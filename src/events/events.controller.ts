import { Controller, Delete, Get, Param, Patch, Post, Body, HttpCode, ParseIntPipe, ValidationPipe, Logger, NotFoundException, Query, UsePipes, UseGuards } from "@nestjs/common"
import { CreateEventDto } from "./input/create-event.dto"
import { UpdateEventDto } from "./input/update-event.dto"
import { Event } from "./event.entity"
import { Like, MoreThan, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Attendee } from "./attendee.entity"
import { EventsService } from "./events.service"
import { ListEvents } from "./input/list.events"
import { CurrentUser } from "src/auth/current-user.decorator"
import { User } from "src/auth/user.entity"
import { AuthGuardJwt } from "src/auth/auth-guard.jwt"

@Controller('/events')
export class EventsController {

  private readonly logger = new Logger(EventsController.name)

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService
  ) { }

  @Get()
  // @UsePipes(new ValidationPipe({ transform: true }))
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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    console.log(typeof id)
    const event = await this.eventsService.getEvent(id)

    if (!event) {
      throw new NotFoundException()
    }

    return event
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async create(
    @Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.createEvent(input, user)
  }

  @Patch(':id')
  async update(
    @Param('id') id,
    @Body(new ValidationPipe({ groups: ['update'] })) input: UpdateEventDto) {
    const event = this.eventsRepository.findOne(id)

    if (!event) {
      throw new NotFoundException()
    }

    return await this.eventsRepository.save({
      ...event,
      ...input,
      // when: input.when ? new Date(input.when) : event.when
    })
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const result = await this.eventsService.deleteEvent(id)
    this.logger.debug(JSON.stringify(result))
    if (result.affected !== 1) {
      throw new NotFoundException()
    }
  }
}
