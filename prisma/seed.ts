// seed city data into the db
import { cities } from "@/lib/cityData";
import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  for (const city of cities) {
    await prisma.city.create({
      data: city,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("City data seeded");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
