import { Request, Response } from "express";

export function root(req: Request, res: Response) {
  res.status(200).send("<h1>Express server is up and running.</h1>");
}
