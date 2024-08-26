// components/CitySunsetSunriseTable.tsx
import { useState, useEffect } from 'react';
import { City, cities } from '../utils/cityData';
import { scrapeCityData, CitySolarData } from '../utils/scraperData';

const CitySunsetSunriseTable: React.FC = () => {
  const [cityData, setCityData] = useState<CitySolarData[]>([]);
  const [selectedCityData, setSelectedCityData] = useState<CitySolarData | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const promises = cities.map(city => scrapeCityData(city, today, 7));
      const results = await Promise.all(promises);
      setCityData(results);
    };

    fetchData();
  }, []);

  const openModal = (data: CitySolarData) => {
    setSelectedCityData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <table className="min-w-full bg-white text-black">
        <thead>
          <tr>
            <th>City</th>
            {[...Array(7)].map((_, i) => (
              <th key={i}>{new Date(Date.now() + i * 86400000).toLocaleDateString()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cityData.map(city => (
            <tr key={city.city} onClick={() => openModal(city)} className="cursor-pointer">
              <td>{city.city}</td>
              {city.data.map(day => (
                <td key={day.date}>
                  <div>Sunrise: {day.sunrise}</div>
                  <div>Sunset: {day.sunset}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedCityData && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{selectedCityData.city} Solar Data</h2>
            {/* Render detailed data here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySunsetSunriseTable;
