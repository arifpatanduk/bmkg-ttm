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
import { FC, useState, useEffect } from "react";

interface PeriodSelectProps {
  selectedYear: number;
  selectedMonth: number;
  selectedPeriod: Period; // Add selectedPeriod as a prop
  onPeriodChange: (period: Period) => void; // Callback to handle period change
}

const PeriodSelect: FC<PeriodSelectProps> = ({
  selectedYear,
  selectedMonth,
  selectedPeriod, // Destructure selectedPeriod
  onPeriodChange,
}) => {
  const [internalSelectedPeriod, setInternalSelectedPeriod] =
    useState<Period | null>(selectedPeriod);

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
      }) as Period;

      setInternalSelectedPeriod(currentPeriod || periods[0]);
      onPeriodChange(currentPeriod || periods[0]); // Automatically pass the selected period to parent
    } else {
      setInternalSelectedPeriod(periods[0]);
      onPeriodChange(periods[0]);
    }
  }, [selectedMonth, selectedYear]);

  // Update internal state when selectedPeriod prop changes
  useEffect(() => {
    setInternalSelectedPeriod(selectedPeriod);
  }, [selectedPeriod]);

  return (
    <Select
      value={internalSelectedPeriod?.startDate} // Control the value of Select
      onValueChange={(value) => {
        const selected = periods.find(
          (periodObj) => periodObj.startDate == value
        );
        setInternalSelectedPeriod(selected || null);
        if (selected) onPeriodChange(selected);
      }}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={
            internalSelectedPeriod?.formattedPeriod || "Pilih Periode"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {periods.map((periodObj, index) => (
          <SelectItem key={index} value={periodObj.startDate}>
            {periodObj.formattedPeriod}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelect;
