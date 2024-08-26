// components/SolarDataTable

import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
    flexRender,
  } from '@tanstack/react-table';
  import { SolarData } from '../utils/scraperData';
  
  type SolarDataTableProps = {
    data: SolarData[];
  };
  
  const columnHelper = createColumnHelper<SolarData>();
  
  const columns = [
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('civilTwilightStart', {
      header: 'Civil Twilight Start',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('sunrise', {
      header: 'Sunrise',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('sunriseAzimuth', {
      header: 'Sunrise Azimuth (°)',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('transitTime', {
      header: 'Transit Time',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('transitAltitude', {
      header: 'Transit Altitude (°)',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('sunset', {
      header: 'Sunset',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('sunsetAzimuth', {
      header: 'Sunset Azimuth (°)',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('civilTwilightEnd', {
      header: 'Civil Twilight End',
      cell: info => info.getValue(),
    }),
  ];
  
  const SolarDataTable: React.FC<SolarDataTableProps> = ({ data }) => {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
  
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-black">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default SolarDataTable;
  