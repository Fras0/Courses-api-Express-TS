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

const app = express();

function setupExpress() {
  app.route("/").get(root);
  app.route("/api/courses").get(getAllCourses);

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
