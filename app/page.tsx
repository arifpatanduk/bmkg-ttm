"use client";

import { City, CitySolarData, Period } from "@/app/types/global";
import CityTable from "@/components/CityTable";
import { DownloadDropdown } from "@/components/DownloadDropdown";
import Filter from "@/components/Filter";
import Header from "@/components/Header";
import TableLoading from "@/components/TableLoading";
import { scrapeCitySolarData } from "@/lib/api";
import { cities } from "@/lib/cityData";
import fetchAndSaveSolarData from "@/lib/cron";
import {
  generateDateHeaders,
  getFormattedDate,
  getPeriod,
  getPreviousMonday,
} from "@/lib/helpers";
import { useEffect, useState, useRef } from "react";

const Home: React.FC = () => {
  const [items, setItems] = useState<CitySolarData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const hasFetchedData = useRef(false); // Prevents effect from running twice

  const [selectedItem, setSelectedItem] = useState<City | null>(null);
  const [startDate, setStartDate] = useState<Date>(
    getPreviousMonday(new Date())
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  const headers = generateDateHeaders(startDate, endDate);

  useEffect(() => {
    if (hasFetchedData.current) return;
    loadScraping();
    hasFetchedData.current = true; // Set the flag to prevent re-running
  }, []);

  const loadScraping = async (startDate?: Date) => {
    setLoading(true); // Start loading
    const scrapedData: CitySolarData[] = [];
    const { dates } = getPeriod(startDate || getPreviousMonday(new Date())); // Get period for headers
    const firstDate = dates[0];
    setStartDate(firstDate);
    setEndDate(dates[dates.length - 1]);

    for (const city of cities) {
      const scrape = await scrapeCitySolarData(
        city,
        getFormattedDate(firstDate),
        7
      );
      scrapedData.push(scrape);
    }
    setItems(scrapedData); // Set the scraped data
    setLoading(false); // End loading
  };

  // Handle filter button click
  const handleFilter = ({ startPeriod }: { startPeriod: Period }) => {
    const date = new Date(startPeriod.startDate);
    loadScraping(date); // Fetch data based on filter
  };

  // Handle clear filter button click
  const handleClear = () => {
    loadScraping(); // Fetch all data without filter
  };

  // for export properties
  // extract city.name, data.sunrise and data.sunset from cities on each date
  const datas = items.map((city) => {
    // Get the first and last date in the city's data
    const firstDate = city.data[0]; // First date
    const lastDate = city.data[city.data.length - 1]; // Last date

    return [
      city.city.name, // City name
      `Terbit: ${firstDate.sunrise} \nTerbenam: ${firstDate.sunset}`, // Sunrise and sunset of the first date
      ...city.data
        .slice(1, -1)
        .map((day) => `Terbit: ${day.sunrise} \nTerbenam: ${day.sunset}`), // Remaining middle dates
      `Terbit: ${lastDate.sunrise} \nTerbenam: ${lastDate.sunset}`, // Sunrise and sunset of the last date
    ];
  });

  // cron job to insert
  // await fetchAndSaveSolarData();

  return (
    <div className="container mx-auto py-6 px-2 mt-20">
      <Header />
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Informasi Terbit Terbenam Matahari
        </h2>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="w-full md:w-auto mb-3 ">
          <Filter onClear={handleClear} onFilter={handleFilter} />
        </div>
        <div className="w-full md:w-auto md:self-end mb-3">
          <DownloadDropdown
            prefixFile="ttm"
            tableElement="city-list-table"
            startDate={startDate}
            cityData={datas}
            headers={["Kota", ...headers]}
          />
        </div>
      </div>
      {loading ? (
        <TableLoading />
      ) : (
        <div>
          <CityTable
            cities={items}
            headers={headers}
            onDetailClick={setSelectedItem}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
