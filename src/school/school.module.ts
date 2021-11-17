import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolController } from "./school.controller";
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher])],
  controllers: [SchoolController]
})
export class SchoolModule { }