import { NextFunction, Request, response, Response } from "express";
import { logger } from "../logger";
import { isInteger } from "../utils";
import { AppDataSource } from "../data-source";
import { Course } from "../models/course";

export async function updateCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const courseId = req.params.courseId,
      changes = req.body;

    if (!isInteger(courseId)) {
      throw `Invalid course id ${courseId}`;
    }

    console.log(courseId);
    AppDataSource.createQueryBuilder()
      .update(Course)
      .set(changes)
      .where("id = :courseId", { courseId })
      .execute();

    res.status(200).json({
      message: `Course ${courseId} was updated successfully`,
    });
  } catch (err) {
    logger.error(`Error calling updateCourse()`);
    return next(err);
  }
}
