import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Lesson } from "./lesson";

@Entity({
  name: "COURSES",
})
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int8" })
  seqNo: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  iconUrl: string;

  @Column({ type: "varchar" })
  longDescription: string;

  @Column({ type: "varchar" })
  category: string;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdatedAt: Date;
}
