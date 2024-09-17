import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { FC } from "react";

const getCurrentMonth = () => new Date().getMonth();

interface MonthSelectProps {
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
}

const MonthSelect: FC<MonthSelectProps> = ({
  selectedMonth,
  setSelectedMonth,
}) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return (
    <Select
      onValueChange={(value) => setSelectedMonth(parseInt(value))}
      defaultValue={String(selectedMonth)}
    >
      <SelectTrigger>
        <SelectValue placeholder={months[selectedMonth]} />
      </SelectTrigger>
      <SelectContent>
        {months.map((month, index) => (
          <SelectItem key={month} value={String(index)}>
            {month}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { MonthSelect, getCurrentMonth };
