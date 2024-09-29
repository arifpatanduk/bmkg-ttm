import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFormattedPeriod } from "@/lib/helpers";
import html2canvas from "html2canvas";
import { Download, FileText, ImageDown, Sheet } from "lucide-react";
import { ExportAsExcel, ExportAsPdf } from "react-export-table";

interface DownloadDropdownProps {
  headers: string[];
  cityData: any[];
  startDate: Date;
  tableElement: string;
  prefixFile: string;
}

export const DownloadDropdown = ({
  headers,
  cityData,
  startDate,
  tableElement,
  prefixFile,
}: DownloadDropdownProps) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const fileName = `${getFormattedPeriod(
    startDate,
    endDate
  )}-${endDate.getFullYear()}`;

  const handleDownloadImage = async (imageType: "jpg" | "png") => {
    const element = document.getElementById(tableElement);
    if (!element) {
      console.error("Element not found");
      return;
    }

    const table = element.querySelector("table");
    const tableHeaders = element.querySelectorAll("thead");
    const tableHead = element.querySelectorAll("thead th");
    const tableRows = element.querySelectorAll("tbody tr");
    const tableCell = element.querySelectorAll("tbody tr td");

    // Add bg-transparent class if imageType is png
    if (imageType === "png") {
      element.classList.add("bg-transparent");

      if (table) table.classList.add("bg-transparent");
      tableHeaders.forEach((header) => header.classList.add("bg-transparent"));
      tableHead.forEach((header) => header.classList.add("bg-transparent"));
      tableRows.forEach((row) =>
        row.classList.remove("odd:bg-white", "even:bg-gray-50")
      );
      tableCell.forEach((header) => header.classList.remove("bg-white"));
    }

    const canvas = await html2canvas(element, {
      backgroundColor: null,
    });

    const data = canvas.toDataURL(`image/${imageType}`);
    const link = document.createElement("a");

    link.href = data;
    link.download = `${prefixFile}-${fileName.replace(/\s/g, "")}.${imageType}`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    // Remove bg-transparent class after download
    if (imageType === "png") {
      element.classList.remove("bg-transparent");

      if (table) table.classList.remove("bg-transparent");
      tableHeaders.forEach((header) =>
        header.classList.remove("bg-transparent")
      );
      tableHead.forEach((header) => header.classList.remove("bg-transparent"));
      tableRows.forEach((row) =>
        row.classList.add("odd:bg-white", "even:bg-gray-50")
      );
    }
  };

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
              fileName={prefixFile + "-" + fileName.replace(/\s/g, "")}
              data={cityData}
              headers={headers}
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
              fileName={prefixFile + "-" + fileName.replace(/\s/g, "")}
              data={cityData}
              headers={headers}
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
          <DropdownMenuItem>
            <span
              className="inline-flex hover:cursor-pointer w-full text-blue-500 hover:text-blue-700"
              onClick={(event) => {
                handleDownloadImage("jpg");
              }}
            >
              <ImageDown className="size-3 my-auto mr-2" /> JPG
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span
              className="inline-flex hover:cursor-pointer w-full text-zinc-500 hover:text-zinc-700"
              onClick={(event) => {
                handleDownloadImage("png");
              }}
            >
              <ImageDown className="size-3 my-auto mr-2" /> PNG
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
