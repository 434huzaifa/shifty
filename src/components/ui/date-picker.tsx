"use client";

import { useEffect, useRef, useState } from "react";
import { format, parse, isValid as isValidDate } from "date-fns";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";

const DISPLAY_FORMAT = "dd-MM-yyyy";
const ISO_FORMAT = "yyyy-MM-dd";

interface DatePickerProps {
  id?: string;
  value: string;
  onChange: (isoDate: string) => void;
}

export function DatePicker({ id, value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedDate = parse(value, ISO_FORMAT, new Date());
  const defaultClassNames = getDefaultClassNames();

  const handleSelect = (date: Date | undefined) => {
    if (date && isValidDate(date)) {
      onChange(format(date, ISO_FORMAT));
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-left text-sm text-gray-800 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      >
        {isValidDate(selectedDate) ? format(selectedDate, DISPLAY_FORMAT) : "Select a date"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-gray-400"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 max-w-[calc(100vw-2rem)] overflow-x-auto rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
          <DayPicker
            mode="single"
            captionLayout="dropdown"
            startMonth={new Date(1950, 0)}
            endMonth={new Date(2100, 11)}
            selected={isValidDate(selectedDate) ? selectedDate : undefined}
            onSelect={handleSelect}
            classNames={{
              root: cn(defaultClassNames.root),
              months: cn("flex flex-col gap-4", defaultClassNames.months),
              month: cn("relative flex flex-col gap-3 pt-1", defaultClassNames.month),
              nav: cn(
                "absolute inset-x-0 top-0 flex items-center justify-between",
                defaultClassNames.nav
              ),
              button_previous: cn(
                "relative z-20 flex size-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100",
                defaultClassNames.button_previous
              ),
              button_next: cn(
                "relative z-20 flex size-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100",
                defaultClassNames.button_next
              ),
              month_caption: cn(
                "flex items-center justify-center text-sm font-semibold text-gray-800",
                defaultClassNames.month_caption
              ),
              dropdowns: cn("flex items-center justify-center gap-2", defaultClassNames.dropdowns),
              dropdown_root: cn(
                "relative inline-flex items-center rounded-md border border-gray-200 px-2 py-1 transition hover:border-gray-300",
                defaultClassNames.dropdown_root
              ),
              dropdown: cn(
                "absolute inset-0 z-10 w-full cursor-pointer appearance-none border-none bg-white p-0 text-sm opacity-0",
                defaultClassNames.dropdown
              ),
              caption_label: cn(
                "flex items-center gap-1 text-sm font-semibold text-gray-800",
                defaultClassNames.caption_label
              ),
              weekdays: cn("flex", defaultClassNames.weekdays),
              weekday: cn(
                "w-9 text-center text-xs font-medium text-gray-400 text-indigo-800 uppercase font-semibold tracking-wide",
                defaultClassNames.weekday
              ),
              week: cn("flex w-full", defaultClassNames.week),
              day: cn(
                "flex size-9 items-center justify-center p-0 text-sm text-black",
                defaultClassNames.day
              ),
              day_button: cn(
                "flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-blue-50",
                defaultClassNames.day_button
              ),
              today: cn("font-semibold text-blue-600", defaultClassNames.today),
              selected: cn(
                "[&>button]:rounded-lg [&>button]:bg-blue-600 [&>button]:text-white [&>button]:hover:bg-blue-700",
                defaultClassNames.selected
              ),
              outside: cn("text-gray-300", defaultClassNames.outside),
              disabled: cn("text-gray-300 [&>button]:hover:bg-transparent", defaultClassNames.disabled),
            }}
          />
        </div>
      )}
    </div>
  );
}
