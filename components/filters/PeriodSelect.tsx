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

  return lastDayOfPreviousMonth; // Return the last Monday found
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

// Updated helper function to format the period and return dates array
const getPeriod = (
  startDate: Date
): { formattedPeriod: string; dates: Date[] } => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // Week ends on Sunday

  // Collect all dates in the period
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate)); // Add current date to the array
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  const formattedPeriod = `${startDate.getDate()} ${startDate.toLocaleString(
    "default",
    {
      month: "short",
    }
  )} - ${endDate.getDate()} ${endDate.toLocaleString("default", {
    month: "short",
  })}`;

  return { formattedPeriod, dates };
};

// Helper function to reset a date to midnight for proper comparison
const resetTimeToMidnight = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
  return newDate;
};

interface PeriodSelectProps {
  selectedYear: number;
  selectedMonth: number;
}

const PeriodSelect: FC<PeriodSelectProps> = ({
  selectedYear,
  selectedMonth,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  // Get the first Monday that may overlap with the selected month
  const startMonday = getLastMondayOfPreviousMonth(selectedYear, selectedMonth);

  // Get all Mondays in the selected month starting from that Monday
  const periods = getMondaysFromDate(startMonday, selectedMonth).map((monday) =>
    getPeriod(monday)
  );

  // Automatically select the current period based on today's date
  useEffect(() => {
    const today = resetTimeToMidnight(new Date()); // Reset today to midnight

    if (
      today.getMonth() === selectedMonth &&
      today.getFullYear() === selectedYear
    ) {
      const currentPeriod = periods.find((periodObj) => {
        const { dates } = periodObj;
        const startDate = resetTimeToMidnight(dates[0]); // Reset start date to midnight
        const endDate = resetTimeToMidnight(dates[dates.length - 1]); // Reset end date to midnight

        return today >= startDate && today <= endDate;
      });

      setSelectedPeriod(
        currentPeriod?.formattedPeriod || periods[0].formattedPeriod
      );
    } else {
      setSelectedPeriod(periods[0].formattedPeriod);
    }
  }, [selectedYear, selectedMonth, periods]);

  return (
    <Select
      onValueChange={(value) => setSelectedPeriod(value)}
      defaultValue={selectedPeriod.trim()}
    >
      <SelectTrigger>
        <SelectValue placeholder={selectedPeriod || "Pilih Periode"} />
      </SelectTrigger>
      <SelectContent>
        {periods.map((periodObj, index) => (
          <SelectItem key={index} value={periodObj.formattedPeriod}>
            {periodObj.formattedPeriod}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelect;
