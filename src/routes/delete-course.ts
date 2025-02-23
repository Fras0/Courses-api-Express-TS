import { NextFunction, Request, response, Response } from "express";
import { logger } from "../logger";
import { isInteger } from "../utils";
import { AppDataSource } from "../data-source";
import { Lesson } from "../models/lesson";
import { Course } from "../models/course";

export async function deleteCourseAndLessons(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const courseId = req.params.courseId;

    if (!isInteger(courseId)) {
      throw `Invalid courseId ${courseId}`;
    }
    AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(Lesson)
        .where("courseId = :courseId", { courseId })
        .execute();

      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(Course)
        .where("id = :courseId", { courseId })
        .execute();
    });

    res.status(200).json({
      message: `course deleted successfully ${courseId}`,
    });
  } catch (err) {
    logger.error(`Error calling deleteCourseAndLessons()`);
    return next(err);
  }
}
