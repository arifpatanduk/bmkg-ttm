"use client"

// pages/CityListPage.tsx
import React, { useState } from 'react';
import SolarDataModal from '../components/SolarDataModal';
import { scrapeData, SolarData } from '../utils/scraperData';

type City = {
  name: string;
  lat: string;
  lon: string;
};

const cities: City[] = [
  { name: 'Kota Sorong', lat: "-0.8811", lon: "131.2875" },
  { name: 'Raja Ampat', lat: "-0.2345", lon: "130.5066" },
  { name: 'Teminabuan', lat: "-1.4055", lon: "132.0265" },
  // Add more cities as needed
];

const CityListPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [solarData, setSolarData] = useState<SolarData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCityClick = async (city: City) => {
    const data = await scrapeData(city.lat, city.lon);  // Adjust scrapeData to accept lat/lon
    setSelectedCity(city);
    setSolarData(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCity(null);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Sunrise</th>
            <th>Sunset</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.name} onClick={() => handleCityClick(city)}>
              <td className="cursor-pointer text-blue-600">{city.name}</td>
              <td>06:19</td>  {/* Replace with actual data */}
              <td>18:24</td>  {/* Replace with actual data */}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCity && (
        <SolarDataModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          city={selectedCity.name}
          solarData={solarData}
        />
      )}
    </div>
  );
};

export default CityListPage;
