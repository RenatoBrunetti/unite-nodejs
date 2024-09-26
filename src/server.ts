import "dotenv/config";
import fastfy from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import {
  createEvent,
  getEvent,
  getEventAttendees,
  registerForEvent,
} from "@/routes/event";
import { checkIn, getAttendeeBadge } from "@/routes/attendee";

const PORT = parseInt(process.env.PORT as string);

const app = fastfy();
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
