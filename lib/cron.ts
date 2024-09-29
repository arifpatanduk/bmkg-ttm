import { DetailCitySolarData } from "@/app/types/global";
import { scrapeCitySolarData } from "@/lib/api";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import cron from "node-cron";
import qs from "query-string";

const prisma = new PrismaClient();

async function fetchAndSaveSolarData() {
  const startDate = new Date("2020-01-01"); // Start from January 1, 2020
  const endDate = new Date("2050-12-31"); // End on December 31, 2050
  const duration = 1; // Duration in days

  try {
    const cities = await prisma.city.findMany(); // Get cities from your database

    for (const city of cities) {
      let currentDate = new Date(startDate);

      // Loop through each day until the end date
      while (currentDate <= endDate) {
        // Format the date to YYYY-MM-DD
        const formattedDate = currentDate.toISOString().split("T")[0];

        // Fetch the solar data for the city
        const solarData = (await scrapeCitySolarData(
          city,
          formattedDate,
          duration,
          true
        )) as DetailCitySolarData;

        // Iterate through the scraped data
        for (const data of solarData.data) {
          // Build the API URL
          const url = qs.stringifyUrl({
            url: `${process.env.API_BASE_URL}/api/solars`,
          });

          try {
            // Make the POST request to save the solar data
            const solardata = await axios.post(url, {
              cityId: city.id,
              date: new Date(data.date).toISOString(), // Ensure date format is correct
              sunrise: data.sunrise,
              sunset: data.sunset,
              dawn: data.beginTwilight,
              dusk: data.endTwilight,
              transit: data.transit,
              transitAzimuth: data.transitAzimuth,
              riseAzimuth: data.riseAzimuth,
              setAzimuth: data.setAzimuth,
            });

            console.log("Solar data saved:", solardata.data); // Log the response
          } catch (postError) {
            // Handle Axios errors more safely by checking the type
            if (axios.isAxiosError(postError)) {
              console.error(
                `Error saving solar data for city ${city.name}:`,
                postError.response?.data || postError.message
              );
            } else if (postError instanceof Error) {
              // Handle non-Axios errors
              console.error(`Unexpected error: ${postError.message}`);
            } else {
              console.error("Unknown error occurred during data saving");
            }
          }
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  } catch (error) {
    // Handle top-level errors
    console.error(
      "Error fetching or saving solar data:",
      error instanceof Error ? error.message : error
    );
  } finally {
    // Ensure Prisma Client disconnects after the job completes
    await prisma.$disconnect();
  }
}

// Schedule the task to run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("Running solar data scraper...");
  await fetchAndSaveSolarData();
});

// Optionally, export this function to use elsewhere
export default fetchAndSaveSolarData;
