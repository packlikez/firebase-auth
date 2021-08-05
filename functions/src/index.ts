import * as functions from "firebase-functions";
import * as express from "express";
import taskRouter from "./task/task.route";
import middlewareErrorHandler from "../app/middlewares/errorHandler";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const app = express();

app.use(taskRouter);

app.use(middlewareErrorHandler);

export const tasks = functions.region("asia-southeast1").https.onRequest(app);
