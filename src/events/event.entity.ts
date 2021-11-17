import { Column, Entity, IsNull, OneToMany, PrimaryGeneratedColumn } from "typeorm"
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
}