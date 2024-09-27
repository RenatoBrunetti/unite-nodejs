import "dotenv/config";

import fastfy from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import {
  createEvent,
  getEvent,
  getEventAttendees,
  registerForEvent,
} from "@/routes/event";
import { checkIn, getAttendeeBadge } from "@/routes/attendee";

import { errorHandler } from "./error-handler";

const PORT = parseInt(process.env.PORT as string);
const HOST = process.env.HOST as string;
const CORS_ORIGIN = process.env.API_CORS_ORIGIN as string;

export const app = fastfy().withTypeProvider<ZodTypeProvider>();
app.register(fastifyCors, { origin: CORS_ORIGIN });
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Fastify Swagger
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "Back-end API description",
      version: "1.0.0.",
    },
  },
  transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, { routePrefix: "/docs" });

// Attendee Routes
app.register(checkIn);
app.register(getAttendeeBadge);

// Event Routes
app.register(createEvent);
app.register(getEvent);
app.register(getEventAttendees);
app.register(registerForEvent);

// Error handler
app.setErrorHandler(errorHandler);

// Server Execution
app.listen({ port: PORT, host: HOST }).then(() => {
  console.log(`HTTP Server Running on port: ${PORT}`);
});
