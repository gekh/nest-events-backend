import { Controller, Delete, Get, Param, Patch, Post, Body, HttpCode, ParseIntPipe, ValidationPipe, Logger } from "@nestjs/common";
import { identity } from "rxjs";
import { CreateEventDto } from "./create-event.dto";
import { UpdateEventDto } from "./update-event.dto";
import { Event } from "./event.entity";
import { Like, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Controller('/events')
export class EventsController {

  private readonly logger = new Logger(EventsController.name)

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>
  ) { }

  @Get()
  async findAll() {
    this.logger.log(`Hit the findAll route.`)
    const events =  await this.repository.find()
    this.logger.debug(`Found ${events.length} events.`)
    this.logger.error(`I'm just kidding. There's no actually error here :)`)
    this.logger.warn(`I warn you. Do you hear me? I warn you like hell!`)
    return events
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    console.log(typeof id)
    return await this.repository.findOne(id)
  }

  @Post()
  async create(@Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    })
  }

  @Patch(':id')
  async update(
    @Param('id') id,
    @Body(new ValidationPipe({ groups: ['update'] })) input: UpdateEventDto) {
    const event = this.repository.findOne(id)
    return await this.repository.save({
      ...event,
      ...input,
      // when: input.when ? new Date(input.when) : event.when
    })
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    // const event = this.repository.findOne(id)
    await this.repository.delete(id)
  }
}
