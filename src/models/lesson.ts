import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Course } from "./course";

@Entity({
  name: "LESSONS",
})
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  duration: string;

  @Column({ type: "int8" })
  seqNo: number;

  @ManyToOne(() => Course, (course) => course.lessons)
  @JoinColumn({
    name: "courseId",
  })
  course: Course;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdatedAt: Date;
}
