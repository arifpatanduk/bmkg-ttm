import { City, CitySolarData } from "@/app/types/global";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/use-modal-store";
import { getFormattedDate } from "@/lib/helpers";
import { CircleAlert } from "lucide-react";

interface CityTableProps {
  cities: CitySolarData[];
  headers: string[];
  onDetailClick: (city: City) => void;
  startDate: Date;
  endDate: Date;
}

const CityTable: React.FC<CityTableProps> = ({
  cities,
  headers,
  onDetailClick,
  startDate,
  endDate,
}) => {
  const { onOpen } = useModal();
  const stringifyStartDate = getFormattedDate(startDate);

  return (
    <div id="city-list-table" className="overflow-x-auto border sm:rounded-lg">
      <Table className="min-w-full text-left text-sm text-gray-600">
        <TableHeader className="bg-gray-50 text-sm">
          <TableRow>
            <TableHead
              scope="col"
              className="px-3 py-3 text-gray-600 font-bold sticky left-0 bg-gray-50 z-10"
            >
              Kota
            </TableHead>
            {headers.map((date, i) => (
              <TableHead
                scope="col"
                className="px-3 py-3 text-gray-600 font-bold"
                key={i}
              >
                {date}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {cities[0].data.length > 0 ? (
            cities.map((city, index) => (
              <TableRow key={index} className="border-b">
                <TableCell className="px-3 py-4 sticky left-0 z-10">
                  <p
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                    onClick={() =>
                      onOpen("detailCityModal", {
                        city: city.city,
                        startDate: stringifyStartDate,
                      })
                    }
                  >
                    {city.city.name}
                  </p>
                </TableCell>
                {city.data.map((day) => (
                  <TableCell className="px-3 py-4" key={day.date}>
                    <div className="flex flex-col md:flex-row items-start md:space-x-4">
                      <div className="flex flex-col md:flex-row items-start">
                        <div className="flex flex-col items-start my-1">
                          <span className="text-xs">Terbit</span>
                          <span className="text-base">{day.sunrise}</span>
                        </div>
                      </div>
                      <div className="hidden md:my-auto md:block h-6 border-l border-gray-300 mx-4"></div>
                      <div className="flex flex-col md:flex-row items-start">
                        <div className="flex flex-col items-start my-1">
                          <span className="text-xs">Terbenam</span>
                          <span className="text-lg">{day.sunset}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="border-b">
              <TableCell colSpan={9} className="px-3 py-4 text-center">
                <div className="flex justify-center">
                  <CircleAlert className="size-5 text-red-500" />
                  <span className="text-red-500 mx-2">Data not available</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CityTable;
