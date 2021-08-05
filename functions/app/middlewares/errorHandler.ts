import {ErrorRequestHandler} from "express";
import * as Boom from "@hapi/boom";

const middlewareErrorHandler: ErrorRequestHandler = (
    err: Boom.Boom,
    req,
    res,
    next
) => {
  if (err.isBoom) {
    const {output, data} = err;
    return res.status(output.statusCode).send({
      statusCode: output.statusCode,
      message: output.payload.message,
      data,
    });
  }

  return res.status(500).send({message: Boom.internal().message});
};

export default middlewareErrorHandler;
