import * as dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  console.log(`Error loading the environment variables,aborting.`);
  process.exit(1);
}

import "reflect-metadata";
import * as express from "express";
import { root } from "./routes/root";
import { isInteger } from "./utils";
import { logger } from "./logger";
import { AppDataSource } from "./data-source";
import { getAllCourses } from "./routes/get-all-courses";
import { defaultErrorHandler } from "./middlewares/default-error-handler";
import { findCourseByUrl } from "./routes/find-course-by-url";
import { findLessonsForCourse } from "./routes/find-lessons-for-course";
import { updateCourse } from "./routes/update-course";
import { createCourse } from "./routes/create-course";
import { deleteCourseAndLessons } from "./routes/delete-course";
import { createUser } from "./routes/create-user";
import { login } from "./routes/login";
import { checkIfAuthenticated } from "./middlewares/authentication-middleware";
import { checkIfAdmin } from "./middlewares/admin-only-middleware";

const cors = require("cors");

const bodyParser = require("body-parser");

const app = express();

function setupExpress() {
  app.use(cors({ origin: true }));

  app.use(bodyParser.json());

  app.route("/").get(root);
  app.route("/api/login").post(login);

  app.use(checkIfAuthenticated);

  app.route("/api/courses").get(getAllCourses);

  app.route("/api/courses/:courseId").get(findCourseByUrl);

  app.route("/api/courses/:courseId/lessons").get(findLessonsForCourse);

  app.route("/api/courses/:courseId").patch(updateCourse);

  app.route("/api/courses").post(createCourse);

  app.route("/api/courses/:courseId").delete(deleteCourseAndLessons);

  app.route("/api/users").post(checkIfAdmin, createUser);

  app.use(defaultErrorHandler);
}

function startServer() {
  let port: number;

  const inputPort = process.env.PORT || process.argv[2];
  if (isInteger(inputPort)) {
    port = parseInt(inputPort);
  }

  if (!port) {
    port = 3000;
  }
  app.listen(port, () => {
    logger.info(
      `HTTP REST API Server is now running at http://localhost:${port}/`
    );
  });
}

AppDataSource.initialize()
  .then(() => {
    logger.info(`The datasource has been initialized successfully`);
    setupExpress();
    startServer();
  })
  .catch((err) => {
    logger.error(`Error during datasource initialization.`, err);
    process.exit(1);
  });
