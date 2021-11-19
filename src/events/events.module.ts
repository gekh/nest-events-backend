import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Attendee } from './attendee.entity'
import { Event } from './event.entity'
import { EventsService } from './events.service'
import { EventsController } from './events.controller'
import { AttendeesSerivce } from './attendees.service'
import { UserEventsController } from './user-events.controller'
import { EventAttendessController } from './event-attendess.controller'
import { currentUserEventAttendanceController } from './current-user-event-attendance.controller'

@Module({
    imports: [
        TypeOrmModule.forFeature([Event, Attendee])
    ],
    controllers: [
        EventsController,
        EventAttendessController,
        UserEventsController,
        currentUserEventAttendanceController
    ],
    providers: [EventsService, AttendeesSerivce],
})
export class EventsModule { }