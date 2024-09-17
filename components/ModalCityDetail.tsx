import { Button } from "./ui/button";
import { City, DetailCitySolarData } from "@/app/types/global";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { scrapeCitySolarData } from "@/lib/api";
import { useEffect, useState } from "react";

interface ModalCityDetailProps {
  city: City | null;
  startDate: string;
  duration: number;
  onClose: () => void;
}

const ModalCityDetail: React.FC<ModalCityDetailProps> = ({
  city,
  startDate,
  duration,
  onClose,
}) => {
  const [solarDetail, setSolarDetail] = useState<DetailCitySolarData | null>(
    null
  );

  useEffect(() => {
    const loadData = async () => {
      if (city) {
        const detail = (await scrapeCitySolarData(
          city,
          startDate,
          duration,
          true
        )) as DetailCitySolarData;
        setSolarDetail(detail);
      }
    };

    loadData();
  }, [city, startDate, duration]);

  if (!city) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h3 className="text-black">{solarDetail?.city.name}</h3>

        <Table>
          <TableHeader>
            <TableRow className="text-black">
              <TableHead className="border p-2">Tanggal</TableHead>
              <TableHead className="border p-2">Waktu Fajar</TableHead>
              <TableHead className="border p-2">Waktu Terbit</TableHead>
              <TableHead className="border p-2">
                Azimuth saat Terbit (°)
              </TableHead>
              <TableHead className="border p-2">Waktu Transit</TableHead>
              <TableHead className="border p-2">
                Azimuth saat Transit (°)
              </TableHead>
              <TableHead className="border p-2">Waktu Terbenam</TableHead>
              <TableHead className="border p-2">
                Azimuth saat Terbenam (°)
              </TableHead>
              <TableHead className="border p-2">Waktu Senja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {city &&
              solarDetail?.data.map((detail, index) => (
                <TableRow className="text-black" key={index}>
                  <TableCell className="border p-2">{detail.date}</TableCell>
                  <TableCell className="border p-2">
                    {detail.beginTwilight}
                  </TableCell>
                  <TableCell className="border p-2">{detail.sunrise}</TableCell>
                  <TableCell className="border p-2">
                    {detail.riseAzimuth}
                  </TableCell>
                  <TableCell className="border p-2">{detail.transit}</TableCell>
                  <TableCell className="border p-2">
                    {detail.transitAzimuth}
                  </TableCell>
                  <TableCell className="border p-2">{detail.sunset}</TableCell>
                  <TableCell className="border p-2">
                    {detail.setAzimuth}
                  </TableCell>
                  <TableCell className="border p-2">
                    {detail.endTwilight}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default ModalCityDetail;
