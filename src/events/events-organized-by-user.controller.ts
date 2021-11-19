import { ClassSerializerInterceptor, Controller, Get, Param, Query, SerializeOptions, UseInterceptors } from "@nestjs/common"
import { EventsService } from "./events.service"

@Controller('/user/:userId/organized-events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController {
  constructor(
    private readonly eventsSerivce: EventsService
  ) { }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Param('userId') userId: number,
    @Query('page') page: number = 1) {
    return await this.eventsSerivce
      .getEventsOrganizedByUserIdPaginated(userId, {
        limit: 5,
        currentPage: page,
        total: true,
      })
  }
}