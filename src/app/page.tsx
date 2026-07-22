"use client";

import { useState, useMemo } from "react";
import { ShiftControls } from "@/components/features/shift-controls";
import { YearCalendar } from "@/components/features/year-calendar";
import { Legend } from "@/components/ui/legend";
import { validatePattern, type ShiftConfig, type ShiftType } from "@/lib/shift-logic";

const DEFAULT_PATTERN: ShiftType[] = ["work", "work", "off"];

export default function Home() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [pattern, setPattern] = useState<ShiftType[]>(DEFAULT_PATTERN);

  const parsedStartDate = useMemo(() => {
    const [y, m, d] = startDate.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [startDate]);

  const year = parsedStartDate.getFullYear();

  const shiftConfig: ShiftConfig = useMemo(() => {
    return {
      startDate: parsedStartDate,
      pattern,
    };
  }, [parsedStartDate, pattern]);

  const isValid = validatePattern(pattern) === null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 px-6 py-5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">🗓️ Shifty</h1>
          <p className="mt-1 text-sm text-gray-500">
            Year-at-a-glance shift rotation calendar
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        {/* Controls */}
        <ShiftControls
          startDate={startDate}
          pattern={pattern}
          onStartDateChange={setStartDate}
          onPatternChange={setPattern}
        />

        {/* Legend */}
        <Legend />

        {/* Calendar — only render if pattern is valid */}
        {isValid ? (
          <YearCalendar year={year} config={shiftConfig} />
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 py-16 text-center text-sm text-gray-400">
            Fix the pattern above to preview the calendar
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/60 px-6 py-4 text-center text-xs text-gray-400">
        Shifty — Shift Rotation Planner
      </footer>
    </div>
  );
}
