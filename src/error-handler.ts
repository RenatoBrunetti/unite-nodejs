import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { BadRequest } from "./routes/_errors";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  // Zod Validation Error
  if (
    error.code === "FST_ERR_VALIDATION" &&
    error.validation &&
    error.validation.length
  ) {
    const zodError = error.validation[0]?.params?.zodError as ZodError;
    if (!zodError) return;

    const errors = zodError.issues.map((issue) => ({
      message: issue.message,
      code: issue.code,
    }));
    return reply
      .status(400)
      .send({ message: "Input validation error.", errors });
  }

  // BadRequest
  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message });
  }

  return reply.status(500).send({ message: "Internal server error", error });
};
