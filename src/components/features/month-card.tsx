"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { getShiftStatus, type ShiftConfig } from "@/lib/shift-logic";
import { Triangle } from "@/components/ui/triangle-icon";

interface MonthCardProps {
  year: number;
  month: number; // 0-indexed
  config: ShiftConfig;
  onDayClick?: (date: Date, event: React.MouseEvent) => void;
  onReset?: () => void;
  isAnyGridHovered: boolean;
  onGridHoverChange: (hovered: boolean) => void;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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

export function MonthCard({
  year,
  month,
  config,
  onDayClick,
  onReset,
  isAnyGridHovered,
  onGridHoverChange,
}: MonthCardProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
  const today = useMemo(() => new Date(), []);

  const cycleEnd = useMemo(() => {
    if (config.pattern.length === 0) return null;
    const end = new Date(config.startDate);
    end.setDate(end.getDate() + config.pattern.length - 1);
    return end;
  }, [config.startDate, config.pattern.length]);

  const clickWindow = useMemo(() => {
    if (config.pattern.length === 0 || cycleEnd === null) return null;
    const canGrow = config.pattern.length < 7;
    const start = new Date(config.startDate);
    if (canGrow) start.setDate(start.getDate() - 1);
    const end = new Date(cycleEnd);
    if (canGrow) end.setDate(end.getDate() + 1);
    return { start, end };
  }, [config.startDate, cycleEnd, config.pattern.length]);

  const dayCells = useMemo(() => {
    const cells: {
      day: number | null;
      date: Date | null;
      status: "work" | "off" | "none";
      inCycle: boolean;
      isClickable: boolean;
    }[] = [];

    // Leading empty cells
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ day: null, date: null, status: "none", inCycle: false, isClickable: false });
    }

    // Actual day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const status = getShiftStatus(date, config);
      const inCycle = cycleEnd !== null && date >= config.startDate && date <= cycleEnd;
      const isClickable =
        config.pattern.length === 0 ||
        inCycle ||
        (clickWindow !== null && date >= clickWindow.start && date <= clickWindow.end);
      cells.push({ day, date, status, inCycle, isClickable });
    }

    return cells;
  }, [year, month, daysInMonth, firstDayOfWeek, config, cycleEnd, clickWindow]);

  const getRangeShapeClasses = (idx: number) => {
    const cell = dayCells[idx];
    if (!cell.inCycle) return "";

    const col = idx % 7;
    const above = idx - 7 >= 0 ? dayCells[idx - 7] : undefined;
    const below = idx + 7 < dayCells.length ? dayCells[idx + 7] : undefined;
    const left = col > 0 ? dayCells[idx - 1] : undefined;
    const right = col < 6 ? dayCells[idx + 1] : undefined;

    const openTop = !!above?.inCycle;
    const openBottom = !!below?.inCycle;
    const openLeft = !!left?.inCycle;
    const openRight = !!right?.inCycle;

    return cn(
      "bg-blue-50",
      !openTop && "rounded-t-md border-t-2",
      !openBottom && "rounded-b-md border-b-2",
      !openLeft && "rounded-l-md border-l-2",
      !openRight && "rounded-r-md border-r-2",
      "border-blue-800"
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Month Header */}
      <div className="relative mb-4 flex items-center justify-center">
        <h3 className="text-center text-base font-bold text-black">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          type="button"
          data-tour="month-reset"
          onClick={onReset}
          title="Reset the entire year's rotation"
          className="absolute right-0 rounded-lg px-2 py-1 text-[10px] font-semibold text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 active:scale-95"
        >
          Reset
        </button>
      </div>

      {/* Day of Week Headers */}
      <div className="mb-2 grid grid-cols-7 gap-y-2.5">
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
      <div
        className="grid grid-cols-7 gap-y-2.5 justify-items-center"
        onMouseEnter={() => onGridHoverChange(true)}
        onMouseLeave={() => onGridHoverChange(false)}
      >
        {dayCells.map((cell, idx) => {
          const isToday = !!(cell.date && today && isSameDay(cell.date, today));
          const isHoverable = cell.isClickable && cell.day !== null;

          const showAllClickable = config.pattern.length > 0 && isAnyGridHovered;

          return (
            <div key={idx} className="group relative flex size-9 items-center justify-center">
              {isHoverable && (
                <Triangle
                  direction="down"
                  className={cn(
                    "absolute -top-1.5 left-1/2 z-10 -translate-x-1/2 text-blue-600 transition",
                    showAllClickable
                      ? "opacity-100 animate-bounce"
                      : "opacity-0 group-hover:animate-bounce group-hover:opacity-100"
                  )}
                />
              )}
              {isToday && (
                <Triangle
                  direction="up"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-blue-600"
                />
              )}
              <button
                type="button"
                disabled={cell.day === null || !cell.isClickable}
                onClick={(e) => {
                  cell.date && onDayClick?.(cell.date, e);
                }}
                className={cn(
                  "relative flex size-9 items-center justify-center transition",
                  cell.day === null && "cursor-default bg-transparent",
                  cell.day !== null && !cell.isClickable && "cursor-default",
                  cell.day !== null && cell.isClickable && "cursor-pointer",
                  getRangeShapeClasses(idx),
                  cell.status === "none" &&
                    cell.day !== null &&
                    !cell.inCycle &&
                    "hover:bg-gray-50"
                )}
              >
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs font-medium transition",
                    cell.status === "work" && "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
                    cell.status === "off" && "bg-rose-100 text-rose-800 ring-1 ring-rose-200",
                    cell.status === "none" && cell.day !== null && "text-black"
                  )}
                >
                  {cell.day}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
