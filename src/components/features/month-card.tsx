"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { getShiftStatus, type ShiftConfig } from "@/lib/shift-logic";

interface MonthCardProps {
  year: number;
  month: number; // 0-indexed
  config: ShiftConfig;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthCard({ year, month, config }: MonthCardProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

  const dayCells = useMemo(() => {
    const cells: { day: number | null; status: "work" | "off" | "none" }[] = [];

    // Leading empty cells
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ day: null, status: "none" });
    }

    // Actual day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const status = getShiftStatus(date, config);
      cells.push({ day, status });
    }

    return cells;
  }, [year, month, daysInMonth, firstDayOfWeek, config]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Month Header */}
      <h3 className="mb-3 text-center text-base font-bold text-black">
        {MONTH_NAMES[month]} {year}
      </h3>

      {/* Day of Week Headers */}
      <div className="mb-1 grid grid-cols-7 gap-y-1.5">
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-semibold tracking-wide text-indigo-800 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-y-1.5 justify-items-center ">
        {dayCells.map((cell, idx) => (
          <div
            key={idx}
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-xs font-medium transition",
              cell.day === null && "bg-transparent",
              cell.status === "work" && "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
              cell.status === "off" && "bg-rose-100 text-rose-800 ring-1 ring-rose-200",
              cell.status === "none" && cell.day !== null && "bg-white text-black"
            )}
          >
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  );
}
