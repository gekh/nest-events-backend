import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "./../src/app.module"
import * as request from "supertest"
import { Connection } from "typeorm"
import * as fs from "fs"
import * as path from "path"
import { response } from "express"

let app: INestApplication
let mod: TestingModule
let connection: Connection

const loadFixtures = async (sqlFileName: string) => {
  const sql = fs.readFileSync(
    path.join(__dirname, 'fixtures', sqlFileName),
    'utf8'
  )

  const queryRunner = connection.driver.createQueryRunner('master')

  for (const c of sql.split(';')) {
    await queryRunner.query(c)
  }
}

describe("Events (e2e)", () => {
  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = mod.createNestApplication()
    await app.init()

    connection = app.get(Connection)
  })

  afterAll(async () => {
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
      .get('/events')
      .expect(200)
      .then(response => {
        // console.log(response.body)
        expect(response.body.data[0].id).toBe(1)
        expect(response.body.data[0].name).toBe('Interesting Party')
        expect(response.body.data[0].description).toBe('That is a crazy event, must go there!')
        expect(response.body.data[0].when).toBe('2021-04-15T18:00:00.000Z')
        expect(response.body.data[0].address).toBe('Local St 101')
      })
  })
})