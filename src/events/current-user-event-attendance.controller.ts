import { Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Put, Query, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common"
import { AuthGuardJwt } from "./../auth/auth-guard.jwt"
import { CurrentUser } from "./../auth/current-user.decorator"
import { JwtStrategy } from "./../auth/jwt.strategy"
import { User } from "./../auth/user.entity"
import { AttendeesSerivce } from "./attendees.service"
import { EventsService } from "./events.service"
import { CreateAttendeeDto } from "./input/create-attendee.dto"

@Controller('events-attendance')
@SerializeOptions({ strategy: 'excludeAll' })
export class currentUserEventAttendanceController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendeesSerivce: AttendeesSerivce,
  ) { }

  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ) {
    return await this.eventsService
      .getEventsAttendedByUserIdPaginated(user.id, {
        currentPage: page,
        limit: 5,
      })
  }

  @Get(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    const attendee = await this.attendeesSerivce
      .findOneByEventIdAndUserId(eventId, user.id)

    if (!attendee) {
      throw new NotFoundException()
    }

    return attendee
  }

  @Put('/:eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user: User,
  ) {
    this.attendeesSerivce.updateOrCreate(input, eventId, user.id)
  }
}