import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { AppDataSource } from "../data-source";
import { Course } from "../models/course";

export async function getAllCourses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.debug(`Called getAllCourses()`);

    const courses = await AppDataSource.getRepository(Course)
      .createQueryBuilder("courses")
      // .leftJoinAndSelect("courses.lessons", "LESSONS") // this is for populating lessons data eagerly with every course
      .orderBy("courses.seqNo")
      .getMany();

    res.status(200).json({
      status: "success",
      data: courses,
    });
  } catch (err) {
    logger.error(`Error calling getAllCourses`);
    return next(err);
  }
}
