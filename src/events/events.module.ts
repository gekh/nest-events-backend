import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AttendeesSerivce } from './attendees.service'
import { EventsOrganizedByUserController } from './events-organized-by-user.controller'
import { EventAttendessController } from './event-attendess.controller'

@Module({
    imports: [
        TypeOrmModule.forFeature([Event, Attendee])
    ],
    controllers: [EventsController, EventAttendessController, EventsOrganizedByUserController],
    providers: [EventsService, AttendeesSerivce],
})
export class EventsModule {}