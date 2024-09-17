import { Period } from "@/app/types/global";

const getFormattedDate = (dateFormat?: Date) => {
  const date = dateFormat || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to find the last Monday of the previous month
const getLastMondayOfPreviousMonth = (year: number, month: number): Date => {
  const lastDayOfPreviousMonth = new Date(year, month, 0);
  while (lastDayOfPreviousMonth.getDay() !== 1) {
    lastDayOfPreviousMonth.setDate(lastDayOfPreviousMonth.getDate() - 1);
  }
  return lastDayOfPreviousMonth;
};

// Get all Mondays starting from a specific Monday and continuing into the next weeks
const getMondaysFromDate = (startDate: Date, selectedMonth: number): Date[] => {
  const mondays: Date[] = [];
  const currentDate = new Date(startDate);
  while (
    currentDate.getMonth() === selectedMonth ||
    currentDate.getDate() >= 25
  ) {
    mondays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return mondays;
};

const getPreviousMonday = (date: Date): Date => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate the difference to Monday
  const previousMonday = new Date(date);
  previousMonday.setDate(date.getDate() - diff); // Set the date to the previous Monday
  console.log("previousMonday", previousMonday);

  return previousMonday;
};

const getFormattedPeriod = (startDate: Date, endDate: Date): string => {
  return `${startDate.getDate()} ${startDate.toLocaleString("default", {
    month: "short",
  })} - ${endDate.getDate()} ${endDate.toLocaleString("default", {
    month: "short",
  })}`;
};

const getPeriod = (startDate: Date): Period => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  const dates = [];
  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    dates.push(new Date(date));
  }
  const formattedPeriod = getFormattedPeriod(startDate, endDate);
  return { formattedPeriod, startDate: getFormattedDate(startDate), dates };
};

const resetTimeToMidnight = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export {
  getLastMondayOfPreviousMonth,
  getMondaysFromDate,
  getPeriod,
  getFormattedDate,
  getFormattedPeriod,
  resetTimeToMidnight,
  getPreviousMonday,
};
