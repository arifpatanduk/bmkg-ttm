import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { FC, useState, useEffect } from "react";

const getMondaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const mondays: Date[] = [];

  // Find the first Monday of the month
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }

  // Collect all Mondays in the month
  while (date.getMonth() === month) {
    mondays.push(new Date(date));
    date.setDate(date.getDate() + 7);
  }

  return mondays;
};

const getPeriod = (startDate: Date): string => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return `${startDate.getDate()} ${startDate.toLocaleString("default", {
    month: "short",
  })} - ${endDate.getDate()} ${endDate.toLocaleString("default", {
    month: "short",
  })}`;
};

interface PeriodSelectProps {
  selectedYear: number;
  selectedMonth: number;
}

const PeriodSelect: FC<PeriodSelectProps> = ({
  selectedYear,
  selectedMonth,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const periods = getMondaysInMonth(selectedYear, selectedMonth).map((monday) =>
    getPeriod(monday)
  );

  // Automatically select the current period based on today's date
  useEffect(() => {
    const today = new Date();
    if (
      today.getMonth() === selectedMonth &&
      today.getFullYear() === selectedYear
    ) {
      const currentPeriod = periods.find((period) => {
        const [startDay, , , , endDay] = period.split(" ");
        const startDate = new Date(
          selectedYear,
          selectedMonth,
          parseInt(startDay)
        );
        const endDate = new Date(selectedYear, selectedMonth, parseInt(endDay));
        return today >= startDate && today <= endDate;
      });
      setSelectedPeriod(currentPeriod || periods[0]);
    } else {
      setSelectedPeriod(periods[0]);
    }
  }, [selectedYear, selectedMonth, periods]);

  return (
    <Select
      onValueChange={(value) => setSelectedPeriod(value)}
      defaultValue={selectedPeriod || ""}
    >
      <SelectTrigger>
        <SelectValue placeholder={selectedPeriod || "Pilih Periode"} />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => (
          <SelectItem key={index} value={period}>
            {period}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelect;
