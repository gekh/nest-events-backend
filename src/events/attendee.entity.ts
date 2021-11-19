import { Expose } from "class-transformer"
import { User } from "src/auth/user.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Event } from "./event.entity"

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}


@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @ManyToOne(() => Event, (event) => event.attendees, {
    // nullable: false
    onDelete: 'CASCADE'
  })
  // @JoinColumn({
  //   name: 'event_id',
  //   referencedColumnName: 'name',
  // })
  @Expose()
  event: Event

  @Column()
  @Expose()
  eventId: number

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted
  })
  @Expose()
  answer: AttendeeAnswerEnum

  @ManyToOne(() => User, (user) => user.attended)
  @JoinColumn()
  @Expose()
  user: User

  @Column()
  userId: number
}