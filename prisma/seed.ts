import { prisma } from "../src/lib/prisma";

async function seed() {
  await prisma.event.create({
    data: {
      id: "13f3af4e-5b99-4e18-a95b-c829f7e4d071",
      title: "Test Summit",
      slug: "test-summit",
      details: "Test event details.",
      maximumAttendees: 120,
    },
  });
}

seed().then(() => {
  console.info("Database seeded!");
  prisma.$disconnect();
});
