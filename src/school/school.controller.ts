import { Controller, Delete, Get, HttpCode, Param, Post } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Controller('school')
export class SchoolController {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) { }

  @Post('/create')
  public async savingRelation() {
    const subject = new Subject()
    subject.name = 'Myth'

    const teacherJohn = new Teacher()
    teacherJohn.name = 'John Wick'

    const teacherHarry = new Teacher()
    teacherHarry.name = 'Harry Harrison'

    subject.teachers = [teacherJohn, teacherHarry]

    await this.subjectRepository.save(subject)
  }

  @Delete('/remove/:id')
  @HttpCode(204)
  public async removingRelation(@Param('id') id) {
    const subject = await this.subjectRepository.findOne(id, {
      relations:['teachers']
    })
    
    subject.teachers = subject.teachers.filter((t) => t.id !== 1)
    await this.subjectRepository.save(subject)
  }
}