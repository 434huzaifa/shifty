"use client";

import { useState } from "react";
import { MonthCard } from "./month-card";
import type { ShiftConfig } from "@/lib/shift-logic";

interface YearCalendarProps {
  year: number;
  config: ShiftConfig;
  onDayClick?: (date: Date, event: React.MouseEvent) => void;
  onReset?: () => void;
}

export function YearCalendar({ year, config, onDayClick, onReset }: YearCalendarProps) {
  const [isAnyGridHovered, setIsAnyGridHovered] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }, (_, month) => (
        <MonthCard
          key={month}
          year={year}
          month={month}
          config={config}
          onDayClick={onDayClick}
          onReset={onReset}
          isAnyGridHovered={isAnyGridHovered}
          onGridHoverChange={setIsAnyGridHovered}
        />
      ))}
    </div>
  );
}
