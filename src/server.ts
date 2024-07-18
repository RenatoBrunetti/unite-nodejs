import "dotenv/config";
import fastfy from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { createEvent, registerForEvent } from "@/routes/event";

const PORT = parseInt(process.env.PORT as string);

const app = fastfy();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Event Routes
app.register(createEvent);
app.register(registerForEvent);

app.listen({ port: PORT }).then(() => {
  console.log(`HTTP Server Running on port: ${PORT}`);
});
