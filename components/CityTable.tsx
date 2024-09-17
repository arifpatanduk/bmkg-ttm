import { City, CitySolarData } from "@/app/types/global";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CityTableProps {
  cities: CitySolarData[];
  onDetailClick: (city: City) => void;
  startDate: Date;
  endDate: Date;
}

const CityTable: React.FC<CityTableProps> = ({
  cities,
  onDetailClick,
  startDate,
  endDate,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB").format(date); // Forces DD/MM/YYYY format
  };

  const generateDateHeaders = (startDate: Date, endDate: Date) => {
    const headers = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      headers.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return headers;
  };

  const headers = generateDateHeaders(startDate, endDate);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kota</TableHead>
          {headers.map((date, i) => (
            <TableHead key={i}>{formatDate(date)}</TableHead>
          ))}
          <TableHead>Detail</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cities.map((city, index) => (
          <TableRow key={index}>
            <TableCell className="border p-2">{city.city.name}</TableCell>
            {city.data.map((day) => (
              <TableCell className="border p-2" key={day.date}>
                <div>Sunrise: {day.sunrise}</div>
                <div>Sunset: {day.sunset}</div>
              </TableCell>
            ))}
            <TableCell className="border p-2">
              <Button onClick={() => onDetailClick(city.city)}>Detail</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CityTable;
