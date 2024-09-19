import { Period } from "@/app/types/global";
import { MonthSelect, getCurrentMonth } from "@/components/filters/MonthSelect";
import PeriodSelect from "@/components/filters/PeriodSelect";
import { YearSelect, getCurrentYear } from "@/components/filters/YearSelect";
import { Button } from "@/components/ui/button";
import {
  getPeriod,
  getLastMondayOfPreviousMonth,
  getMondaysFromDate,
  resetTimeToMidnight,
} from "@/lib/helpers";
import { useState, useEffect } from "react";

interface FilterProps {
  onFilter: (filters: { startPeriod: Period }) => void;
  onClear: () => void; // Clear filter function
}

const Filter: React.FC<FilterProps> = ({ onFilter, onClear }) => {
  const today = new Date();
  const endDay = new Date(today);
  endDay.setDate(today.getDate() + 6); // Week ends on Sunday

  // Get the default periods based on the selected year and month
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(getCurrentMonth());
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
    setStartDate(selectedPeriod);
  }, [selectedPeriod]);

  const [startDate, setStartDate] = useState<Period>(selectedPeriod);

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onFilter({ startPeriod: startDate }); // Pass the selected startDate
  };

  const handleClear = () => {
    setSelectedYear(getCurrentYear()); // Reset selectedYear to currentYear
    setSelectedMonth(getCurrentMonth()); // Reset selectedMonth to currentMonth
    setSelectedPeriod(currentPeriod || periods[0]); // Reset selectedPeriod to currentPeriod
    setStartDate(currentPeriod || periods[0]); // Clear startDate
    onClear(); // Trigger the onClear callback to reset data
  };

  // Handle period change from PeriodSelect
  const onPeriodChange = (period: Period) => {
    setSelectedPeriod(period); // Update selected period
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
      <div className="basis-full md:basis-7/12">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-auto">
            <YearSelect
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          </div>
          <div className="w-full md:w-auto">
            <MonthSelect
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
          <div className="w-full md:w-auto">
            <PeriodSelect
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedPeriod={selectedPeriod}
              onPeriodChange={onPeriodChange}
            />
          </div>
          <div className="flex w-full md:w-auto space-x-4">
            <Button className="w-full md:w-auto" type="submit">
              Filter
            </Button>
            {/* <Button
              variant="ghost"
              className="w-1/2 md:w-auto text-red-400 hover:text-red-600 outline-dashed outline-1"
              onClick={handleClear}
            >
              Reset
            </Button> */}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Filter;
