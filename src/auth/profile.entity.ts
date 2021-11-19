import { Expose } from "class-transformer"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  @Expose()
  age: number
}