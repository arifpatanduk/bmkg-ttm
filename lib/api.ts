import { City, CitySolarData, DetailCitySolarData } from "@/app/types/global";
import * as cheerio from "cheerio";

// Unified function to fetch both list and detailed data
export async function scrapeCitySolarData(
  city: City,
  startDate: string,
  duration: number,
  detailed: boolean = false // default to false for list data
): Promise<CitySolarData | DetailCitySolarData> {
  try {
    const url = `https://aa.usno.navy.mil/calculated/mrst?body=10&date=${startDate}&reps=${duration}&lat=${city.lat}&lon=${city.lon}&label=${city.name}&tz=9&tz_sign=1&height=0&submit=Get+Data`;
    const res = await fetch(url);
    const data = await res.text();

    console.log("url", url);

    const $ = cheerio.load(data);
    const preText = $("pre").text();
    const lines = preText.split("\n");

    const relevantLines = lines
      .slice(17, -1)
      .filter((line) => line.trim() !== "");

    // Initialize the result object
    const result = {
      city: city,
      data: [],
    } as CitySolarData | DetailCitySolarData;

    relevantLines.forEach((line) => {
      const columns = line.trim().split(/\s+/);

      if (columns.length === 12) {
        if (detailed) {
          // Detailed data processing
          (result as DetailCitySolarData).data.push({
            date: `${columns[0]} ${columns[1]} ${columns[2]}`,
            sunrise: columns[5],
            sunset: columns[9],
            beginTwilight: columns[4],
            endTwilight: columns[11],
            riseAzimuth: columns[6],
            setAzimuth: columns[10],
            transit: columns[7],
            transitAzimuth: columns[8],
          });
        } else {
          // Minimal list data processing
          (result as CitySolarData).data.push({
            date: `${columns[0]} ${columns[1]} ${columns[2]}`,
            sunrise: columns[5],
            sunset: columns[9],
          });
        }
      }
    });

    return result;
  } catch (error) {
    console.error("Error scraping data:", error);
    return { city: city, data: [] };
  }
}
