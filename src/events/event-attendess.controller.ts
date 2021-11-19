import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, SerializeOptions, UseInterceptors } from "@nestjs/common"
import { AttendeesSerivce } from "./attendees.service"

@Controller('events/:eventId/attendees')
@SerializeOptions({strategy: 'excludeAll'})
export class EventAttendessController {
  constructor(
    private readonly attendeeSerivce: AttendeesSerivce
  ) { }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('eventId', ParseIntPipe) eventId: number) {
    return await this.attendeeSerivce.findByEventId(eventId)
  }
}