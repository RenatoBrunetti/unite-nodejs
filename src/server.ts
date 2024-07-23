import "dotenv/config";
import fastfy from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { createEvent, getEvent, registerForEvent } from "@/routes/event";
import { getAttendeeBadge } from "@/routes/attendee";

const PORT = parseInt(process.env.PORT as string);

const app = fastfy();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Attendee Routes
app.register(getAttendeeBadge);

// Event Routes
app.register(createEvent);
app.register(getEvent);
app.register(registerForEvent);

app.listen({ port: PORT }).then(() => {
  console.log(`HTTP Server Running on port: ${PORT}`);
});
