import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import * as request from "supertest"
import { Connection } from "typeorm"
import { tokenForUser as tokenForUserBase, loadFixtures as loadFixturesBase } from "./utils"
import { User } from "../src/auth/user.entity"

let app: INestApplication
let mod: TestingModule
let connection: Connection

const loadFixtures = async (sqlFileName: string) =>
  loadFixturesBase(connection, sqlFileName)

const tokenForUser = (
  user: Partial<User> = {
    id: 1,
    username: 'e2e-test'
  }
): string => tokenForUserBase(app, user)

describe("Events (e2e)", () => {
  beforeEach(async () => {
    mod = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = mod.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())

    await app.init()

    connection = app.get(Connection)
  })

  afterEach(async () => {
    await app.close()
  })

  it('should return an empty list of events', () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .then(response => {
        expect(response.body.data.length).toBe(0)
      })
  })

  it('should return a single event', async () => {
    await loadFixtures('1-event-1-user.sql')

    return request(app.getHttpServer())
      .get('/events/1')
      .expect(200)
      .then(response => {
        expect(response.body.id).toBe(1)
        expect(response.body.name).toBe('Interesting Party')
        expect(response.body.description).toBe('That is a crazy event, must go there!')
        expect(response.body.when).toBe('2021-04-15T18:00:00.000Z')
        expect(response.body.address).toBe('Local St 101')
      })
  })

  it('should return a list of (2) events', async () => {
    await loadFixtures('2-events-1-user.sql')

    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .then(response => {
        expect(response.body.first).toBe(1)
        expect(response.body.last).toBe(2)
        expect(response.body.limit).toBe(2)
        expect(response.body.total).toBe(2)
      })
  })

  it('should throw an error when creating event being unauthenticated', () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({})
      .expect(401)
  })

  it('should throw an eror when creating an event with a wrong input', async () => {
    await loadFixtures('1-user.sql')

    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({})
      .expect(400)
      .then(response => {
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: [
            'OMG! What are you doing?!',
            'name must be a string',
            'description must be longer than or equal to 3 characters',
            'when must be a valid ISO 8601 date string'
          ],
          error: 'Bad Request'
        })

      })
  })

  it('should create an event', async () => {
    await loadFixtures('1-user.sql')
    const when = (new Date).toISOString().replace(/\d\d\dZ$/, '000Z')

    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({
        name: 'E2e Event',
        description: 'A fake event from e2e tests.',
        when: when,
        address: 'Street 123'
      })
      .expect(201)
      .then(_ => {
        return request(app.getHttpServer())
          .get('/events/1')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              id: 1,
              name: 'E2e Event',
              description: 'A fake event from e2e tests.',
              when: when,
              address: 'Street 123'
            })
          })
      })
  })

  it('should throw an error when changing an nonexistent event', async () => {
    await loadFixtures('1-user.sql')
    const when = (new Date).toISOString().replace(/\d\d\dZ$/, '000Z')

    return request(app.getHttpServer())
      .patch('/events/100')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({
        name: 'E2e Event',
        description: 'A fake event from e2e tests.',
        when: when,
        address: 'Street 123'
      })
      .expect(404)
  })

  it('should throw an error when changing an event of another user', async () => {
    await loadFixtures('1-event-2-users.sql')
    const when = (new Date).toISOString().replace(/\d\d\dZ$/, '000Z')

    return request(app.getHttpServer())
      .patch('/events/1')
      .set('Authorization', `Bearer ${tokenForUser({ id: 2, username: "nasty" })}`)
      .send({
        name: 'E2e Event',
        description: 'A fake event from e2e tests.',
        when: when,
        address: 'Street 123'
      })
      .expect(403)
  })

  it('should update an event name', async () => {
    await loadFixtures('1-event-1-user.sql')

    return request(app.getHttpServer())
      .patch('/events/1')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({
        name: 'Updated event name',
      })
      .expect(200).then(response => {
        expect(response.body.name).toBe('Updated event name')
      })
  })

  it('should remove an event', async () => {
    await loadFixtures('1-event-1-user.sql')

    return request(app.getHttpServer())
      .delete('/events/1')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .expect(204).then(_ => {
        return request(app.getHttpServer())
          .get('/event/1')
          .expect(404)
      })
  })

  it('should throw an error when removing an event of another user.', async () => {
    await loadFixtures('1-event-2-users.sql')

    return request(app.getHttpServer())
      .delete('/events/1')
      .set('Authorization', `Bearer ${tokenForUser({ id: 2, username: "nasty" })}`)
      .expect(403)
  })

  it('should throw an error when removing a nonexistent event', async () => {
    await loadFixtures('1-user.sql')

    return request(app.getHttpServer())
      .delete('/events/424')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .expect(404)
  })
})