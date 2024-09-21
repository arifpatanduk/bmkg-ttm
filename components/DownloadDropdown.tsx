import { CitySolarData } from "@/app/types/global";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFormattedPeriod } from "@/lib/helpers";
import { Download, FileText, ImageDown, Sheet } from "lucide-react";
import { ExportAsExcel, ExportAsPdf } from "react-export-table";

interface DownloadDropdownProps {
  headers: string[];
  cities: CitySolarData[];
  startDate: Date;
  endDate: Date;
}

export const DownloadDropdown = ({
  headers,
  cities,
  startDate,
  endDate,
}: DownloadDropdownProps) => {
  const fileName = `sun-data-${getFormattedPeriod(
    startDate,
    endDate
  )}-${endDate.getFullYear()}`;

  // extract city.name, data.sunrise and data.sunset from cities on each date
  const datas = cities.map((city) => {
    // Get the first and last date in the city's data
    const firstDate = city.data[0]; // First date
    const lastDate = city.data[city.data.length - 1]; // Last date

    return [
      city.city.name, // City name
      `Sunrise: ${firstDate.sunrise} \nSunset: ${firstDate.sunset}`, // Sunrise and sunset of the first date
      ...city.data
        .slice(1, -1)
        .map((day) => `Sunrise: ${day.sunrise} \nSunset: ${day.sunset}`), // Remaining middle dates
      `Sunrise: ${lastDate.sunrise} \nSunset: ${lastDate.sunset}`, // Sunrise and sunset of the last date
    ];
  });

  return (
    <div className="w-full md:w-auto md:self-end mb-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          <Download className="size-4 mr-2" />
          Download
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full md:w-auto">
          <DropdownMenuItem className="text-red-500">
            <ExportAsPdf
              fileName={fileName.replace(/\s/g, "")}
              data={datas}
              headers={["Kota", ...headers]}
            >
              {(props) => (
                <span
                  className="inline-flex hover:cursor-pointer w-full text-red-500 hover:text-red-700"
                  {...props}
                >
                  <FileText className="size-3 my-auto mr-2" />
                  PDF
                </span>
              )}
            </ExportAsPdf>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ExportAsExcel
              name={fileName}
              fileName={fileName.replace(/\s/g, "")}
              data={datas}
              headers={["Kota", ...headers]}
            >
              {(props) => (
                <span
                  className="inline-flex hover:cursor-pointer w-full text-green-500 hover:text-green-700"
                  {...props}
                >
                  <Sheet className="size-3 my-auto mr-2" /> Excel
                </span>
              )}
            </ExportAsExcel>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-blue-500">
            <ImageDown className="size-3 mr-2" />
            JPG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
