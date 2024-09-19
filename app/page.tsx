"use client";

import { City, CitySolarData, Period } from "@/app/types/global";
import CityTable from "@/components/CityTable";
import Filter from "@/components/Filter";
import TableLoading from "@/components/TableLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { scrapeCitySolarData } from "@/lib/api";
import { cities } from "@/lib/cityData";
import {
  generateDateHeaders,
  getFormattedDate,
  getPeriod,
  getPreviousMonday,
} from "@/lib/helpers";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const Home: React.FC = () => {
  const [items, setItems] = useState<CitySolarData[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const hasFetchedData = useRef(false); // Prevents effect from running twice

  const [selectedItem, setSelectedItem] = useState<City | null>(null);
  const [startDate, setStartDate] = useState<Date>(
    getPreviousMonday(new Date())
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

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

  return (
    <div className="containter mx-auto py-6 px-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Image
            src="https://cdn.bmkg.go.id/Web/Logo-BMKG-new-242x300.png"
            alt="BMKG Logo"
            width={64}
            height={64}
            className="mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">
              Badan Meteorologi Klimatologi dan Geofisika
            </h1>
            <p className="text-sm text-gray-500">
              Stasiun Geofisika Kelas III Sorong
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Informasi Terbit Terbenam Matahari
        </h2>
      </div>
      <div className="mb-3">
        <Filter onClear={handleClear} onFilter={handleFilter} />
      </div>
      {loading ? (
        <TableLoading />
      ) : (
        <div>
          <CityTable
            cities={items}
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
