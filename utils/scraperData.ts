// utils/scraperData.ts
import * as cheerio from 'cheerio';
import { City } from './cityData';

export type SolarData = {
  date: string;
  civilTwilightStart: string;
  civilTwilightEnd: string;
  sunrise: string;
  sunriseAzimuth: string;
  sunset: string;
  sunsetAzimuth: string;
  transitAltitude: string;
  transitTime: string;
};

export type CitySolarData = {
  city: string;
  data: { date: string; sunrise: string; sunset: string }[];
};

export async function scrapeCityData(city: City, startDate: string, duration: number): Promise<CitySolarData> {
  try {
    const url = `https://aa.usno.navy.mil/calculated/mrst?body=10&date=${startDate}&reps=${duration}&lat=${city.lat}&lon=${city.lon}&label=${city.name}&tz=9&tz_sign=1&height=0&submit=Get+Data`;
    const res = await fetch(url);
    const data = await res.text();

    const $ = cheerio.load(data);
    const preText = $('pre').text();
    const lines = preText.split('\n');

    const relevantLines = lines.slice(17, -1).filter(line => line.trim() !== '');

    const citySolarData: CitySolarData = { city: city.name, data: [] };

    relevantLines.forEach(line => {
      const columns = line.trim().split(/\s+/);
      if (columns.length === 12) {
        citySolarData.data.push({
          date: `${columns[0]} ${columns[1]} ${columns[2]}`,
          sunrise: columns[5],
          sunset: columns[9],
        });
      }
    });

    return citySolarData;
  } catch (error) {
    console.error('Error scraping data:', error);
    return { city: city.name, data: [] };
  }
}

export async function scrapeData(lat: string, lon: string): Promise<SolarData[]> {
  try {
    // const res = await fetch('https://aa.usno.navy.mil/calculated/mrst?body=10&date=2024-08-01&reps=31&lat=-0.8811&lon=131.2875&label=Sorong&tz=9&tz_sign=1&height=0&submit=Get+Data');
    const res = await fetch(`https://aa.usno.navy.mil/calculated/mrst?body=10&date=2024-08-01&reps=7&lat=${lat}&lon=${lon}&label=City&tz=9&tz_sign=1&height=0&submit=Get+Data`);
    const data = await res.text();

    const $ = cheerio.load(data);

    // Locate the text in the <pre> element that contains the data
    const preText = $('pre').text(); 
    const lines = preText.split('\n');

    // Slice to get only the relevant rows (after the headers and before any trailing content)
    const relevantLines = lines.slice(17, -1).filter(line => line.trim() !== '');
   
    const solarData: SolarData[] = [];

    relevantLines.forEach((line) => {
      const columns = line.trim().split(/\s+/);
      console.log('length', columns.length);
      
      if (columns.length === 12) {
        solarData.push({
          date: `${columns[0]} ${columns[1]} ${columns[2]}`,
          civilTwilightStart: columns[4],
          sunrise: columns[5],
          sunriseAzimuth: columns[6],
          transitTime: columns[7],
          transitAltitude: columns[8],
          sunset: columns[9],
          sunsetAzimuth: columns[10],
          civilTwilightEnd: columns[11],
        });
      }
    });

    return solarData;
  } catch (error) {
    console.error('Error scraping data:', error);
    return [];
  }
}
