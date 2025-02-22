import * as dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  console.log(`Error loading the environment variables,aborting.`);
  process.exit(1);
}
import * as express from "express";
import { root } from "./routes/root";
import { isInteger } from "./utils";
import { logger } from "./logger";
import { AppDataSource } from "./data-source";
import { log } from "winston";

const app = express();

function setupExpress() {
  app.route("/").get(root);
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
