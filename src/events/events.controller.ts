import { Controller, Delete, Get, Param, Patch, Post, Body, HttpCode, ParseIntPipe, ValidationPipe, Logger, NotFoundException } from "@nestjs/common";
import { identity } from "rxjs";
import { CreateEventDto } from "./create-event.dto";
import { UpdateEventDto } from "./update-event.dto";
import { Event } from "./event.entity";
import { Like, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendee } from "./attendee.entity";
import { EventsService } from "./events.service";

@Controller('/events')
export class EventsController {

  private readonly logger = new Logger(EventsController.name)

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsSerivice: EventsService
  ) { }

  @Get()
  async findAll() {
    this.logger.log(`Hit the findAll route.`)
    const events =  await this.eventsRepository.find()
    this.logger.debug(`Found ${events.length} events.`)
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
    const event =  await this.eventsSerivice.getEvent(id)
    
    if (!event) {
      throw new NotFoundException()
    }

    return event
  }

  @Post()
  async create(@Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto) {
    return await this.eventsRepository.save({
      ...input,
      when: new Date(input.when),
    })
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
    const event = this.eventsRepository.findOne(id)
    
    if (!event) {
      throw new NotFoundException()
    }

    await this.eventsRepository.delete(id)
  }
}
