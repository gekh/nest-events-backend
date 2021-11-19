import { Controller, Delete, Get, Param, Patch, Post, Body, HttpCode, ParseIntPipe, ValidationPipe, Logger, NotFoundException, Query, UsePipes, UseGuards, ForbiddenException, SerializeOptions, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common"
import { CreateEventDto } from "./input/create-event.dto"
import { UpdateEventDto } from "./input/update-event.dto"
import { Event } from "./event.entity"
import { Like, MoreThan, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Attendee } from "./attendee.entity"
import { EventsService } from "./events.service"
import { ListEvents } from "./input/list.events"
import { CurrentUser } from "./../auth/current-user.decorator"
import { User } from "./../auth/user.entity"
import { AuthGuardJwt } from "./../auth/auth-guard.jwt"

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {

  private readonly logger = new Logger(EventsController.name)

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    private readonly eventsService: EventsService
  ) { }

  @Get()
  // @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    this.logger.debug(JSON.stringify(filter))
    const events = await this.eventsService
      .getEventsWithAttendeeCountFilteredPaginated(filter, {
        total: true,
        currentPage: filter.page ?? 1,
        limit: 2,
      })
    // this.logger.debug(`Found ${events.length} events.`)
    this.logger.error(`I'm just kidding. There's no actually error here :)`)
    this.logger.warn(`I warn you. Do you hear me? I warn you like hell!`)
    return events
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id)
    const event = await this.eventsService.getEventWithAttendeeCount(id)

    if (!event) {
      throw new NotFoundException()
    }

    return event
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.createEvent(input, user)
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ groups: ['update'] })) input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.getEvent(id)
    // const event = await this.eventsRepository.findOne(id, {
    //   relations: ['organizer'],
    // })
    this.logger.debug(id)
    this.logger.debug(JSON.stringify(event))
    this.logger.debug(user.id)

    if (!event) {
      throw new NotFoundException()
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(null, 'You are not authorized to change this event')
    }

    return this.eventsService.updateEvent(event, input)
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.getEvent(id)

    if (!event) {
      throw new NotFoundException()
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(null, 'You are not authorized to remove this event')
    }

    await this.eventsService.deleteEvent(id)
  }


  /*/
    @Get('/practice')
    async practice() {
      console.log(process.env.NODE_ENV)
      return await this.eventsRepository.find({
        select: ['id', 'when'],
        where: [{
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-12T13:00:00'))
        }, {
          description: Like('%meet%')
        }],
        take: 2,
        order: {
          'id': 'DESC',
        },
      })
    }
  
    @Get('/practice2')
    async practice2() {
      return await this.eventsRepository.findOne(1, {
        relations: ['attendees']
      })
    }
  
    @Get('/practice3')
    async practice3() {
      const event = await this.eventsRepository.findOne(1, {
        relations: ['attendees'],
      })
  
      // const event = new Event()
      // event.id = 1
  
      const attendee = new Attendee()
      attendee.name = 'Rachel'
      // attendee.event = event
  
      event.attendees.push(attendee)
      // event.attendees = []
  
      // await this.attendeeRepository.save(attendee)
      await this.eventsRepository.save(event)
  
      return 'SUCCESS'
    }
  /**/

}
