import { getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { EventsService } from "./events.service"
import { Test } from "@nestjs/testing"
import { Event } from "./event.entity"

describe('EventsService', () => {
  let service: EventsService
  let repository: Repository<Event>
  let selectQb
  let deleteQb

  beforeEach(async () => {
    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    }

    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
            where: jest.fn(),
            delete: jest.fn(),
            execute: jest.fn(),
          }
        },
      ],
    }).compile()

    service = module.get<EventsService>(EventsService)
    repository = module.get<Repository<Event>>(
      getRepositoryToken(Event)
    )
  })

  describe('updateEvent', () => {
    it('should update the event', () => {
      const dummyId = 1
      const dummyInput = {
        name: 'Some Great Event',
        description: "Welcome everyone. It is a great event.",
        when: "2021-11-24 18:00:00",
        address: "Paper St. 123",
      }
      const dummyEvent =
      {
        id: dummyId,
        ...dummyInput,
        when: new Date(dummyInput.when),
      }

      const repoSpy = jest.spyOn(repository, 'save')
        .mockResolvedValue(dummyEvent as Event)

      expect(service.updateEvent(
        new Event({ id: dummyId }), dummyInput
      )).resolves.toEqual(dummyEvent)

      expect(repoSpy).toBeCalledWith(dummyEvent)
    })
  })

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const dummyId = 1
      const createQueryBuilderSpy = jest.spyOn(repository, 'createQueryBuilder')
      const deleteSpy = jest.spyOn(selectQb, 'delete')
        .mockReturnValue(deleteQb)
      const whereSpy = jest.spyOn(deleteQb, 'where')
        .mockReturnValue(deleteQb)
      const executeSpy = jest.spyOn(deleteQb, 'execute')

      await expect(service.deleteEvent(dummyId)).resolves.toBe(undefined)

      expect(createQueryBuilderSpy).toBeCalledTimes(1)
      expect(createQueryBuilderSpy).toBeCalledWith('e')

      expect(deleteSpy).toBeCalledTimes(1)

      expect(whereSpy).toBeCalledTimes(1)
      expect(whereSpy).toBeCalledWith('id = :id', { id: dummyId })

      expect(executeSpy).toBeCalledTimes(1)
    })
  })
})