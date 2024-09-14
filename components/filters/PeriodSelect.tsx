import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { FC, useState, useEffect } from "react";

// Helper function to find the last Monday of the previous month
const getLastMondayOfPreviousMonth = (year: number, month: number): Date => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfPreviousMonth = new Date(year, month, 0); // Get the last day of the previous month

  // Start from the last day of the previous month and go backwards until you find a Monday
  while (lastDayOfPreviousMonth.getDay() !== 1) {
    lastDayOfPreviousMonth.setDate(lastDayOfPreviousMonth.getDate() - 1);
  }

  // Ensure that this Monday is before or equal to the first day of the current month
  if (lastDayOfPreviousMonth <= firstDayOfMonth) {
    return lastDayOfPreviousMonth;
  }

  return firstDayOfMonth; // Default fallback
};

// Helper function to get all Mondays starting from a specific Monday and continuing into the next weeks
const getMondaysFromDate = (startDate: Date, selectedMonth: number): Date[] => {
  const mondays: Date[] = [];
  const currentDate = new Date(startDate);

  // Collect all Mondays while the start date's Monday is still within the selected month
  while (
    currentDate.getMonth() === selectedMonth || // Current month matches the selected month
    (currentDate.getMonth() < selectedMonth && currentDate.getDate() >= 25) // Handles last week starting in previous month
  ) {
    mondays.push(new Date(currentDate)); // Add the Monday to the list
    currentDate.setDate(currentDate.getDate() + 7); // Move to the next Monday
  }

  return mondays;
};

// Helper function to format the period string
const getPeriod = (startDate: Date): string => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // Week ends on Sunday
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

  // Get the first Monday that may overlap with the selected month
  const startMonday = getLastMondayOfPreviousMonth(selectedYear, selectedMonth);

  // Get all Mondays in the selected month starting from that Monday
  const periods = getMondaysFromDate(startMonday, selectedMonth).map((monday) =>
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
