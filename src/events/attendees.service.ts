import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Attendee } from "./attendee.entity"
import { CreateAttendeeDto } from "./input/create-attendee.dto"

@Injectable()
export class AttendeesSerivce {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>
  ) { }

  public async findByEventId(eventId: number): Promise<Attendee[]> {
    return await this.attendeeRepository.find({
      // where: ['eventId=:eventId', {eventId}]
      event: { id: eventId }
    })
  }

  public async findOneByEventIdAndUserId(
    eventId: number, userId: number,
  ): Promise<Attendee | undefined> {
    return await this.attendeeRepository.findOne({
      event: { id: eventId },
      user: { id: userId },
    })
  }

  public async updateOrCreate(
    input: CreateAttendeeDto, eventId: number, userId: number,
  ): Promise<Attendee> {
    const attendee = await this.findOneByEventIdAndUserId(eventId, userId)
      ?? new Attendee()
      attendee.userId = userId
      attendee.eventId = eventId
      attendee.answer = input.answer

      //TODO: rest of inputs
      return await this.attendeeRepository.save(attendee)

  }
}