"use client";

import Filter from "@/components/Filter";
// pages/CityListPage.tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cities } from "@/utils/cityData";
import React, { useState } from "react";

const getCurrentWeekDates = (): string[] => {
  const dates: string[] = [];
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  // const today = new Date();
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate the previous Monday
  const mondayOffset = (currentDay === 0 ? -6 : 1) - currentDay; // If Sunday, go back 6 days, else adjust to the nearest Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  // Generate dates from Monday to Sunday
  for (let i = 0; i < 7; i++) {
    const nextDate: Date = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    const formattedDate: string = nextDate.toLocaleDateString("id-ID", options);
    dates.push(formattedDate);
  }

  return dates;
};

const CityListPage: React.FC = () => {
  const dates = getCurrentWeekDates();

  return (
    <div className="mx-auto px-6 py-6">
      <h1>Sunrise and Sunset Data for Cities</h1>
      <div className="my-4">
        <Filter />
      </div>
      <Table>
        <TableHeader className="bg-zinc-200">
          <TableRow>
            <TableHead className="text-black font-bold">Kota</TableHead>
            {dates.map((date) => (
              <TableHead key={date} className="text-black font-bold">
                {date}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {cities.map((city) => (
            <TableRow key={city.name}>
              <TableCell className="font-medium">{city.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CityListPage;
