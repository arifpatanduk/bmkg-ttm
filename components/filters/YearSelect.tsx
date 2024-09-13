import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { FC, useState } from "react";

const getCurrentYear = () => new Date().getFullYear();

interface YearSelectProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

const YearSelect: FC<YearSelectProps> = ({ selectedYear, setSelectedYear }) => {
  const years = Array.from({ length: 151 }, (_, i) => 1900 + i);

  return (
    <Select
      onValueChange={(value) => setSelectedYear(parseInt(value))}
      defaultValue={String(selectedYear)}
    >
      <SelectTrigger>
        <SelectValue placeholder={String(selectedYear)} />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { YearSelect, getCurrentYear };
