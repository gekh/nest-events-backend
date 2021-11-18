import { IsOptional } from "class-validator"
import { User } from "src/auth/user.entity"
import { Column, Entity, IsNull, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Attendee } from "./attendee.entity"

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    when: Date

    @Column({nullable: true})
    address: string

    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        // eager: true,
        // cascade: true
    })
    attendees: Attendee[]

    @ManyToOne(() => User, (user) => user.organized)
    @JoinColumn()
    organizer?: User

    // Virtual properties
    attendeeCount?: number
    attendeeAccepted?: number
    attendeeMaybe?: number
    attendeeRejected?: number
}