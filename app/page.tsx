"use client";

import { City, CitySolarData } from "@/app/types/global";
import CityTable from "@/components/CityTable";
import Filter from "@/components/Filter";
import ModalCityDetail from "@/components/ModalCityDetail";
import { scrapeCitySolarData } from "@/lib/api";
import { cities } from "@/lib/cityData";
import { getFormattedDate, getPeriod, getPreviousMonday } from "@/lib/helpers";
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
    setStartDate(dates[0]);
    setEndDate(dates[dates.length - 1]);

    for (const city of cities) {
      const scrape = await scrapeCitySolarData(
        city,
        getFormattedDate(startDate),
        7
      );
      scrapedData.push(scrape);
    }
    setItems(scrapedData); // Set the scraped data
    setLoading(false); // End loading
  };

  // Handle filter button click
  const handleFilter = ({ startPeriod }: { startPeriod: string }) => {
    const date = new Date(startPeriod);
    loadScraping(date); // Fetch data based on filter
  };

  // Handle clear filter button click
  const handleClear = () => {
    loadScraping(); // Fetch all data without filter
  };

  return (
    <div className="containter mx-auto p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Sunrise and Sunset Data</h2>
      </div>
      {loading ? (
        <p>Loading data...</p> // Show this while loading
      ) : (
        <div>
          <div className="mb-3">
            <Filter onClear={handleClear} onFilter={handleFilter} />
          </div>
          <CityTable
            cities={items}
            onDetailClick={setSelectedItem}
            startDate={startDate}
            endDate={endDate}
          />
          {selectedItem && (
            <ModalCityDetail
              city={selectedItem}
              startDate={getFormattedDate()}
              duration={7}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
