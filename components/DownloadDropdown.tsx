import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, ImageDown, Sheet } from "lucide-react";

export const DownloadDropdown = () => {
  return (
    <div className="w-full md:w-auto md:self-end mb-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          <Download className="size-4 mr-2" />
          Download
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full md:w-auto">
          <DropdownMenuItem className="text-red-500">
            <FileText className="size-3 mr-2" />
            PDF
          </DropdownMenuItem>
          <DropdownMenuItem className="text-green-500">
            <Sheet className="size-3 mr-2" />
            Excel
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
