import { Event } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface CreateEventParams {
  title: string;
  details?: string | null;
  maximumAttendees?: number | null;
  slug: string;
}

export async function findUniqueEventSlug(slug: string): Promise<Event | null> {
  return prisma.event.findUnique({ where: { slug } });
}

export async function createEvent(data: CreateEventParams): Promise<Event> {
  return prisma.event.create({
    data: {
      title: data.title,
      details: data.details,
      maximumAttendees: data.maximumAttendees,
      slug: data.slug,
    },
  });
}
