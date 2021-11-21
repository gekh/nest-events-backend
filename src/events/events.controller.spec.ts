import { User } from "../auth/user.entity"
import { Repository } from "typeorm"
import { Event } from "./event.entity"
import { EventsController } from "./events.controller"
import { EventsService } from "./events.service"
import { ListEvents } from "./input/list.events"
import { ForbiddenException, NotFoundException } from "@nestjs/common"

// beforeEach(() => console.log('a whole file'))

describe('EventsController Group', () => {
  let eventsController: EventsController
  let eventsService: EventsService
  let eventsRepository: Repository<Event>

  // describe('EC Sub Group', () => {
  //   beforeEach(() => console.log('in Sub Group'))

  //   it('should be 4', () => {
  //     expect(2+2).toEqual(4)
  //   })
  // })

  // beforeAll(() => console.log('in EC Group'))
  beforeEach(() => {
    // console.log('in EC Group')
    eventsService = new EventsService(eventsRepository)
    eventsController = new EventsController(eventsRepository, eventsService)
  })
  /**/
  it('should return a list of events.', async () => {
    const result = {
      first: 1,
      last: 1,
      limit: 2,
      data: []
    }

    // eventsService.getEventsWithAttendeeCountFilteredPaginated
    //   = jest.fn().mockImplementation((): any => result)

    const spy = jest
      .spyOn(eventsService, 'getEventsWithAttendeeCountFilteredPaginated')
      .mockImplementation((): any => {
        return { first: 1, last: 1, limit: 2, data: [] }
      })

    expect(await eventsController.findAll(new ListEvents()))
      .toEqual({ first: 1, last: 1, limit: 2, data: [] })
    expect(spy).toBeCalledTimes(1)
  })

  it('should not delete an event when it is not found.', async () => {
    const findSpy = jest.spyOn(eventsService, 'getEvent')
      .mockImplementation((): any => undefined)
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent')

    try {
      await eventsController.remove(1, new User())
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
    }

    expect(deleteSpy).toBeCalledTimes(0)
    expect(findSpy).toBeCalledTimes(1)
  })

  it('should not delete an event that do not belong to a user', async () => {
    const getEventSpy = jest.spyOn(eventsService, 'getEvent')
      .mockImplementation((): any => { return { id: 179, organizerId: 424 } })
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent')

    try {
      await eventsController.remove(179, { id: 111 } as User)
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException)
    }

    expect(getEventSpy).toBeCalledTimes(1)
    expect(getEventSpy).toBeCalledWith(179)
    expect(deleteSpy).toBeCalledTimes(0)
  })

  it('should delete an event', async () => {
    const getEventSpy = jest.spyOn(eventsService, 'getEvent')
      .mockImplementation((): any => { return { id: 179, organizerId: 424 } })

    const deleteEventSpy = jest.spyOn(eventsService, 'deleteEvent')
      .mockImplementation()

    await eventsController.remove(179, { id: 424 } as User)

    expect(getEventSpy).toBeCalledTimes(1)
    expect(getEventSpy).toBeCalledWith(179)

    expect(deleteEventSpy).toBeCalledTimes(1)
    expect(deleteEventSpy).toBeCalledWith(179)
  })
  /**/
})