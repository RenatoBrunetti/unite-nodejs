import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { error } from "@/config";
import { eventService } from "@/services";
import { generateSlug } from "@/utils/slug";

import { BadRequest } from "../_errors";

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({ eventId: z.string().uuid() }),
        },
      },
    },
    async (request, reply) => {
      const data = request.body;
      const slug = generateSlug(data.title);
      const eventWithSameSlug = await eventService.findUniqueEventSlug(slug);
      if (!eventWithSameSlug) {
        throw new BadRequest(error.event.create.duplicatedEventTitle);
      }
      const event = await eventService.createEvent({ ...data, slug });
      return reply.status(201).send({ eventId: event.id });
    }
  );
}
