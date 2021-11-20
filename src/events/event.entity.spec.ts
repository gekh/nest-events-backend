import { Logger } from "@nestjs/common"
import { Event } from "./event.entity"

const logger = new Logger('Event entity spec')

test('Event should be initialized thorugh contructor.', () => {
  const event = new Event({
    name: 'Some event',
    description: 'This is gonna be fun!',
  })

  expect(event).toEqual({
    name: 'Some event',
    description: 'This is gonna be fun!',
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    attendeeCount: undefined,
    attendeeAccepted: undefined,
    attendeeMaybe: undefined,
    attendeeRejected: undefined,
  })


    
})