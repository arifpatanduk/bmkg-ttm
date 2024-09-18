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
import { formatDate, generateDateHeaders } from "@/lib/helpers";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

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
                  {date}
                </TableHead>
              ))}
              <TableHead
                scope="col"
                className="px-6 py-3 text-gray-600 font-bold"
              ></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities[0].data.length > 0 ? (
              cities.map((city, index) => (
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
              ))
            ) : (
              <TableRow className="border-b bg-white">
                <TableCell colSpan={8} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <ExclamationCircleIcon className="size-5 text-red-500" />
                    <span className="text-red-500 mx-2">
                      Data not available
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default CityTable;
