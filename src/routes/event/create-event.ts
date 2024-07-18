import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { error } from "@/config";
import { eventService } from "@/services";
import { generateSlug } from "@/utils/slug";

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
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
      console.log("slug:", slug);
      const eventWithSameSlug = await eventService.findUniqueEventSlug(slug);
      if (eventWithSameSlug !== null) {
        throw new Error(error.event.create.duplicatedEventTitle);
      }
      const event = await eventService.createEvent({ ...data, slug });
      return reply.status(201).send({ eventId: event.id });
    }
  );
}
