"use client"

import { useState, useEffect } from 'react';
import { scrapeData, SolarData } from '../utils/scraperData';
import SolarDataTable from '@/components/SolarDataTable';

const HomePage = () => {
  const [data, setData] = useState<SolarData[]>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await scrapeData();
      setData(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Kota Sorong</h1>
      {data ? <SolarDataTable data={data} /> : <p>Loading...</p>}
    </div>
  );
};

export default HomePage;