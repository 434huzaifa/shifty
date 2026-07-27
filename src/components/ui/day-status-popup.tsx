"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";
import type { ShiftType } from "@/lib/shift-logic";

interface DayStatusPopupProps {
  date: Date;
  position: { top: number; left: number };
  onSelect: (type: ShiftType) => void;
  onClose: () => void;
}

export function DayStatusPopup({ date, position, onSelect, onClose }: DayStatusPopupProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      data-tour="day-status-popup"
      style={{ top: position.top, left: position.left }}
      className="fixed z-50 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
    >
      <div className="mb-2 text-center text-xs font-semibold text-gray-500">
        {format(date, "EEE, MMM d yyyy")}
      </div>
      <div className="flex gap-1.5">
        <button
          type="button"
          data-tour="day-status-work"
          onClick={() => onSelect("work")}
          className="flex-1 rounded-lg bg-emerald-500 px-2 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 active:scale-95"
        >
          Work
        </button>
        <button
          type="button"
          data-tour="day-status-off"
          onClick={() => onSelect("off")}
          className="flex-1 rounded-lg bg-rose-500 px-2 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600 active:scale-95"
        >
          Off
        </button>
      </div>
    </div>
  );
}
