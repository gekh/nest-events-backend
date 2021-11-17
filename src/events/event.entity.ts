import { Column, Entity, IsNull, PrimaryGeneratedColumn } from "typeorm"

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
}