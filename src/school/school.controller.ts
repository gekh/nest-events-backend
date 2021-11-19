import { Controller, Delete, Get, HttpCode, Logger, Param, ParseIntPipe, Post } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { json } from "stream/consumers";
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Controller('school')
export class SchoolController {
  private readonly logger = new Logger(SchoolController.name)
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) { }

  @Post('/create')
  public async savingRelation() {
    // const subject = new Subject()
    // subject.name = 'Myth'

    const subject = await this.subjectRepository.findOne(4)

    const teacherJohn = await this.teacherRepository.findOne(5)
    const teacherHarry = await this.teacherRepository.findOne(6)
    this.logger.debug(JSON.stringify([teacherJohn, teacherHarry]))

    return await this.subjectRepository.createQueryBuilder()
      .relation(Subject, 'teachers')
      .of(subject)
      .add([teacherJohn, teacherHarry])
    
    // const teacherJohn = new Teacher()
    // teacherJohn.name = 'John Wick'

    // const teacherHarry = new Teacher()
    // teacherHarry.name = 'Harry Harrison'

    // subject.teachers = [teacherJohn, teacherHarry]
    // await this.subjectRepository.save(subject)


    // await this.teacherRepository.save([teacherJohn, teacherHarry])
  }

  @Delete('/remove/:id')
  @HttpCode(204)
  public async removingRelation(@Param('id', ParseIntPipe) id: number) {
    // const subject = await this.subjectRepository.findOne(id, {
    //   relations:['teachers']
    // })

    // subject.teachers = subject.teachers.filter((t) => t.id !== 1)
    // await this.subjectRepository.save(subject)

    await this.subjectRepository.createQueryBuilder('s')
      .update()
      .set({ name: "Confidential" })
      .execute()
  }
}