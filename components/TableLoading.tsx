import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableLoading = () => {
  return (
    <div className="overflow-x-auto shadow-sm sm:rounded-lg animate-pulse">
      <Table className="min-w-full text-left text-sm text-gray-600">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-gray-600 font-bold">
              Kota
            </TableHead>
            {[...Array(7)].map((_, i) => (
              <TableHead key={i} className="px-6 py-3 text-gray-600 font-bold">
                <div className="h-4 bg-gray-300 rounded"></div>
              </TableHead>
            ))}
            <th className="px-6 py-3"></th>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-b bg-white">
              <TableCell className="px-6 py-4">
                <div className="h-4 bg-gray-300 rounded"></div>
              </TableCell>
              {[...Array(7)].map((_, cellIndex) => (
                <TableCell key={cellIndex} className="px-6 py-4">
                  <div className="h-4 bg-gray-300 rounded"></div>
                </TableCell>
              ))}
              <TableCell className="px-6 py-4 text-right">
                <div className="h-4 bg-gray-300 rounded"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableLoading;
