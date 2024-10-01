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
import React from "react";

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
    <div id="city-list-table" className="overflow-x-auto border rounded-[12px]">
      <Table className="min-w-full text-left text-sm text-black">
        <TableHeader className="bg-gray-100 text-sm">
          {/* First row for the dates */}
          <TableRow>
            <TableHead
              scope="col"
              className="px-3 py-3 text-black font-bold sticky left-0 bg-gray-100 z-10"
              rowSpan={2}
            >
              Kota
            </TableHead>
            {headers.map((date, i) => (
              <TableHead
                scope="col"
                className="px-3 py-3 text-black font-bold text-center"
                key={i}
                colSpan={2} // Each date column will span two subcolumns
              >
                {date}
              </TableHead>
            ))}
          </TableRow>
          {/* Second row for the "Terbit" and "Terbenam" subheaders */}
          <TableRow>
            {headers.map((_, i) => (
              <React.Fragment key={i}>
                <TableHead
                  scope="col"
                  className="px-3 py-1 text-black font-semibold text-center"
                  key={`terbit-${i}`}
                >
                  Terbit
                </TableHead>
                <TableHead
                  scope="col"
                  className="px-3 py-1 text-black font-semibold text-center"
                  key={`terbenam-${i}`}
                >
                  Terbenam
                </TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {cities[0].data.length > 0 ? (
            cities.map((city, index) => (
              <TableRow
                key={index}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-200 border-b border-gray-300"
              >
                <TableCell className="px-3 py-1 sticky left-0 z-10 bg-white md:bg-transparent">
                  <p
                    className="text-base text-black font-bold hover:underline cursor-pointer"
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
                  <React.Fragment key={day.date}>
                    <TableCell className="px-3 py-1 text-center font-medium">
                      {day.sunrise}
                    </TableCell>
                    <TableCell className="px-3 py-1 text-center font-medium">
                      {day.sunset}
                    </TableCell>
                  </React.Fragment>
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
