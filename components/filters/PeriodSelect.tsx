import { Period } from "@/app/types/global";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  getLastMondayOfPreviousMonth,
  getMondaysFromDate,
  getPeriod,
  resetTimeToMidnight,
} from "@/lib/helpers";
import { FC, useState, useEffect, useMemo } from "react";

interface PeriodSelectProps {
  selectedYear: number;
  selectedMonth: number;
  onPeriodChange: (period: Period) => void; // Callback to handle period change
}

const PeriodSelect: FC<PeriodSelectProps> = ({
  selectedYear,
  selectedMonth,
  onPeriodChange,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);

  // Memoize the periods to prevent recalculating them on every render
  const periods = useMemo(() => {
    const startMonday = getLastMondayOfPreviousMonth(
      selectedYear,
      selectedMonth
    );
    return getMondaysFromDate(startMonday, selectedMonth).map((monday) =>
      getPeriod(monday)
    );
  }, [selectedYear, selectedMonth]);

  // Automatically select the current period based on today's date
  useEffect(() => {
    const today = resetTimeToMidnight(new Date()); // Reset today to midnight

    // If today's date is in the selected month and year, set the current period
    if (
      today.getMonth() === selectedMonth &&
      today.getFullYear() === selectedYear
    ) {
      const currentPeriod = periods.find((periodObj) => {
        const { dates } = periodObj;
        const startDate = resetTimeToMidnight(dates[0]); // Reset start date to midnight
        const endDate = resetTimeToMidnight(dates[dates.length - 1]); // Reset end date to midnight

        return today >= startDate && today <= endDate;
      }) as Period;

      // Only update if the selected period has changed to avoid re-renders
      if (currentPeriod && currentPeriod !== selectedPeriod) {
        setSelectedPeriod(currentPeriod);
        onPeriodChange(currentPeriod);
      } else if (!selectedPeriod) {
        // If no period is selected yet, default to the first period
        setSelectedPeriod(periods[0]);
        onPeriodChange(periods[0]);
      }
    } else if (!selectedPeriod) {
      // If the current date doesn't fall in the selected year and month, set to the first period
      setSelectedPeriod(periods[0]);
      onPeriodChange(periods[0]);
    }
  }, [selectedYear, selectedMonth, periods, selectedPeriod, onPeriodChange]);

  return (
    <Select
      onValueChange={(value) => {
        const selected = periods.find(
          (periodObj) => periodObj.formattedPeriod === value
        );
        // Only update if a different period is selected
        if (selected && selected !== selectedPeriod) {
          setSelectedPeriod(selected);
          onPeriodChange(selected);
        }
      }}
      value={selectedPeriod?.formattedPeriod || ""}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={selectedPeriod?.formattedPeriod || "Pilih Periode"}
        />
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
