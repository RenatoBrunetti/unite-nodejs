import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { error } from "@/config";
import { prisma } from "@/lib";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        params: z.object({ attendeeId: z.coerce.number().int() }),
        response: {},
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const attendee = await prisma.attendee.findUnique({
        select: { name: true, email: true, event: { select: { title: true } } },
        where: { id: attendeeId },
      });
      if (!attendee) throw new Error(error.attendee.get.attendeeNotFound);

      return reply.send({ attendee });
    }
  );
}
