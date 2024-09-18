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

const generateDateHeaders = (startDate: Date, endDate: Date) => {
  const headers: string[] = [];
  const currentDate = new Date(startDate);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  while (currentDate <= endDate) {
    headers.push(currentDate.toLocaleDateString("id-ID", options)); // Format ke "17 Sep 2024"
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return headers;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-GB").format(date); // Forces DD/MM/YYYY format
};

export {
  getLastMondayOfPreviousMonth,
  getMondaysFromDate,
  getPeriod,
  getFormattedDate,
  getFormattedPeriod,
  resetTimeToMidnight,
  getPreviousMonday,
  generateDateHeaders,
  formatDate,
};
