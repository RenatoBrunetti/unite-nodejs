import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { error } from "@/config";
import { prisma } from "@/lib";

import { BadRequest } from "../_errors";

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Register an attendee for an event",
        tags: ["attendees"],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { name, email } = request.body;

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: { eventId_email: { email, eventId } },
      });
      if (attendeeFromEmail) {
        throw new BadRequest(error.event.register.registeredEmail);
      }

      const [event, eventMaximumAttendees] = await Promise.all([
        prisma.event.findUnique({
          where: { id: eventId },
        }),
        prisma.attendee.count({
          where: { eventId },
        }),
      ]);
      if (
        event?.maximumAttendees &&
        eventMaximumAttendees >= event?.maximumAttendees
      ) {
        throw new BadRequest(error.event.register.maximumAttendees);
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        },
      });

      return reply.status(201).send({ attendeeId: attendee.id });
    }
  );
}
