import { MonthSelect, getCurrentMonth } from "@/components/filters/MonthSelect";
import PeriodSelect from "@/components/filters/PeriodSelect";
import { YearSelect, getCurrentYear } from "@/components/filters/YearSelect";
import { useState } from "react";

const Filter: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(getCurrentMonth());

  return (
    <div className="flex space-x-4">
      <YearSelect
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <MonthSelect
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      <PeriodSelect selectedYear={selectedYear} selectedMonth={selectedMonth} />
    </div>
  );
};

export default Filter;
