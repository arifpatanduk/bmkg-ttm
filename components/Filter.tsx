import { Period } from "@/app/types/global";
import { MonthSelect, getCurrentMonth } from "@/components/filters/MonthSelect";
import PeriodSelect from "@/components/filters/PeriodSelect";
import { YearSelect, getCurrentYear } from "@/components/filters/YearSelect";
// Make sure Period is imported
import { Button } from "@/components/ui/button";
import {
  getPeriod,
  getLastMondayOfPreviousMonth,
  getMondaysFromDate,
  resetTimeToMidnight,
} from "@/lib/helpers";
import { useState, useEffect } from "react";

interface FilterProps {
  onFilter: (filters: { startPeriod: string }) => void;
  onClear: () => void; // Clear filter function
}

const Filter: React.FC<FilterProps> = ({ onFilter, onClear }) => {
  const today = new Date();
  const endDay = new Date(today);
  endDay.setDate(today.getDate() + 6); // Week ends on Sunday

  // Get the default periods based on the selected year and month
  const selectedYear = getCurrentYear();
  const selectedMonth = getCurrentMonth();
  const startMonday = getLastMondayOfPreviousMonth(selectedYear, selectedMonth);
  const periods = getMondaysFromDate(startMonday, selectedMonth).map((monday) =>
    getPeriod(monday)
  );

  // Automatically select the current period based on today's date
  const currentPeriod = periods.find((periodObj) => {
    const { dates } = periodObj;
    const startDate = resetTimeToMidnight(dates[0]);
    const endDate = resetTimeToMidnight(dates[dates.length - 1]);

    return today >= startDate && today <= endDate;
  });

  const [selectedPeriod, setSelectedPeriod] = useState<Period>(
    currentPeriod || periods[0] // Default to the current period or the first period
  );

  useEffect(() => {
    // Update the startDate whenever selectedPeriod changes
    setStartDate(selectedPeriod.startDate);
  }, [selectedPeriod]);

  const [startDate, setStartDate] = useState<string>(selectedPeriod.startDate);

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onFilter({ startPeriod: startDate }); // Pass the selected startDate
  };

  const handleClear = () => {
    setStartDate(""); // Clear startDate
    onClear(); // Trigger the onClear callback to reset data
  };

  // Handle period change from PeriodSelect
  const onPeriodChange = (period: Period) => {
    setSelectedPeriod(period); // Update selected period
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-row">
      <div className="basis-7/12">
        <div className="flex flex-row items-center space-x-4">
          <YearSelect selectedYear={selectedYear} setSelectedYear={() => {}} />
          <MonthSelect
            selectedMonth={selectedMonth}
            setSelectedMonth={() => {}}
          />
          <PeriodSelect
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onPeriodChange={onPeriodChange} // Pass the handler to PeriodSelect
          />
          <Button type="submit">Filter</Button>
          <Button
            variant="ghost"
            className="text-red-400 hover:text-red-600 outline-dashed outline-1"
            onClick={handleClear}
          >
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Filter;
