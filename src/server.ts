import "dotenv/config";

import fastfy from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import {
  createEvent,
  getEvent,
  getEventAttendees,
  registerForEvent,
} from "@/routes/event";
import { checkIn, getAttendeeBadge } from "@/routes/attendee";

const PORT = parseInt(process.env.PORT as string);

const app = fastfy();
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

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Attendee Routes
app.register(checkIn);
app.register(getAttendeeBadge);

// Event Routes
app.register(createEvent);
app.register(getEvent);
app.register(getEventAttendees);
app.register(registerForEvent);

app.listen({ port: PORT }).then(() => {
  console.log(`HTTP Server Running on port: ${PORT}`);
});
