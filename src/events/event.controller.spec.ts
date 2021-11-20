import { User } from "./../auth/user.entity"
import { Repository } from "typeorm"
import { Event } from "./event.entity"
import { EventsController } from "./events.controller"
import { EventsService } from "./events.service"
import { ListEvents } from "./input/list.events"
import { NotFoundException } from "@nestjs/common"

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
      .mockImplementation((): any => result)

    expect(await eventsController.findAll(new ListEvents()))
      .toEqual(result)
    expect(spy).toBeCalledTimes(1)
  })

  it('should not delete an event when it is not found.', async () => {
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent')
    const findSpy = jest.spyOn(eventsService, 'getEvent')
      .mockImplementation((): any => undefined)

    try {
      await eventsController.remove(1, new User())
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
    }

    expect(deleteSpy).toBeCalledTimes(0)
    expect(findSpy).toBeCalledTimes(1)
  })

  it('should not delete an event that do not belong to a user', async () => {
    
  })

  it('should delete an event', async () => {
    
  })
  /**/
})