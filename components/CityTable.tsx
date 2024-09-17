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
    <>
      <div className="overflow-x-auto shadow-sm sm:rounded-lg">
        <Table className="min-w-full text-left text-sm text-gray-600">
          <TableHeader className="bg-gray-50 text-sm">
            <TableRow>
              <TableHead
                scope="col"
                className="px-6 py-3 text-gray-600 font-bold"
              >
                Kota
              </TableHead>
              {headers.map((date, i) => (
                <TableHead
                  scope="col"
                  className="px-6 py-3 text-gray-600 font-bold"
                  key={i}
                >
                  {formatDate(date)}
                </TableHead>
              ))}
              <TableHead
                scope="col"
                className="px-6 py-3 text-gray-600 font-bold"
              ></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((city, index) => (
              <TableRow key={index} className="border-b bg-white">
                <TableCell className="px-6 py-4">{city.city.name}</TableCell>
                {city.data.map((day) => (
                  <TableCell className="px-6 py-4" key={day.date}>
                    <div>Sunrise: {day.sunrise}</div>
                    <div>Sunset: {day.sunset}</div>
                  </TableCell>
                ))}
                <TableCell className="px-6 py-4 text-right">
                  <Button
                    variant="link"
                    onClick={() => onDetailClick(city.city)}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default CityTable;
