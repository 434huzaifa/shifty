"use client";

import { MonthCard } from "./month-card";
import type { ShiftConfig } from "@/lib/shift-logic";

interface YearCalendarProps {
  year: number;
  config: ShiftConfig;
}

export function YearCalendar({ year, config }: YearCalendarProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }, (_, month) => (
        <MonthCard key={month} year={year} month={month} config={config} />
      ))}
    </div>
  );
}
