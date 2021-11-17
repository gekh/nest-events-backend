import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from './teacher.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects, {
    cascade: true
  })
  @JoinTable({
    name: 'subject_m2m_teacher',
    joinColumn: {
      name: 'sid',
      referencedColumnName: 'id',
    }, 
    inverseJoinColumn: {
      name: 'tid',
    },
  })
  teachers: Teacher[];
}