import "dotenv/config";
import fastfy from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { createEvent } from "@/routes";

const PORT = parseInt(process.env.PORT as string);

const app = fastfy();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);

app.listen({ port: PORT }).then(() => {
  console.log(`HTTP Server Running on port: ${PORT}`);
});
