import { ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, SerializeOptions, UseInterceptors } from "@nestjs/common"
import { AttendeesSerivce } from "./attendees.service"
import { EventsService } from "./events.service"

@Controller('/user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class UserEventsController {
  constructor(
    private readonly eventsSerivce: EventsService,
    private readonly attendeesSerivce: AttendeesSerivce,
  ) { }

  @Get('/organized-events')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1) {
    return await this.eventsSerivce
      .getEventsOrganizedByUserIdPaginated(userId, {
        limit: 5,
        currentPage: page,
        total: true,
      })
  }

  // @Get('/event-attendance')
  // async findAllAttendedEvent(
  //   @Param('userId', ParseIntPipe) userId: number,
  // ) {
  //   return await this.attendeesSerivce
  //     .
  // }
  // @Get('/event-attendance/:eventId')
  // async findOneAttendedEvent(
  //   @Param('userId', ParseIntPipe) userId: number,
  //   @Param('eventId', ParseIntPipe) eventId: number,
  // ) {
  //   return await this.attendeesSerivce
  //     .findOneByEventIdAndUserId(eventId, userId)
  // }
}