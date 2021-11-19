import { Expose } from "class-transformer"
import { IsOptional } from "class-validator"
import { User } from "src/auth/user.entity"
import { PaginationResult } from "src/pagination/paginator"
import { Column, Entity, IsNull, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Attendee } from "./attendee.entity"

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number

    @Column()
    @Expose()
    name: string

    @Column()
    @Expose()
    description: string

    @Column()
    @Expose()
    when: Date

    @Column({nullable: true})
    @Expose()
    address: string

    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        // eager: true,
        // cascade: true
    })
    attendees: Attendee[]

    @ManyToOne(() => User, (user) => user.organized)
    @JoinColumn({name:'organizerId'})
    @Expose()
    organizer: User

    @Column({nullable:true})
    organizerId:number

    // Virtual properties
    attendeeCount?: number
    attendeeAccepted?: number
    attendeeMaybe?: number
    attendeeRejected?: number
}

export type PaginatedEvents = PaginationResult<Event>