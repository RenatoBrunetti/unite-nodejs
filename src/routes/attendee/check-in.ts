import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { error } from "@/config";
import { prisma } from "@/lib";

import { BadRequest } from "../_errors";

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        summary: "Check-in an attendee",
        tags: ["check-ins"],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: { attendeeId },
      });
      if (attendeeCheckIn) {
        throw new BadRequest(error.attendee.checkin.alreadyCheckedin);
      }

      await prisma.checkIn.create({ data: { attendeeId } });

      return reply.status(201).send();
    }
  );
}
