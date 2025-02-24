import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

export function checkIfAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req["user"];

  if (user?.isAdmin) {
    logger.error(`The user is not an admin, access denied`);
    res.sendStatus(403);
    return;
  }

  logger.debug(`The user is a valid admin, granting access.`);
  next();
}
