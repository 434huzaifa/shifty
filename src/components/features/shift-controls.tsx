"use client";

import { cn } from "@/lib/utils";
import { validatePattern, type ShiftType } from "@/lib/shift-logic";
import { SavedRotationsDropdown } from "@/components/ui/saved-rotations-dropdown";
import { DatePicker } from "@/components/ui/date-picker";
import type { SavedRotation } from "@/lib/validations";

interface ShiftControlsProps {
  startDate: string;
  pattern: ShiftType[];
  onStartDateChange: (value: string) => void;
  onPatternChange: (value: ShiftType[]) => void;
  onReset: () => void;
  savedRotations: SavedRotation[];
  selectedRotationId: number | null;
  onSelectRotation: (rotation: SavedRotation) => void;
  isLoadingRotations: boolean;
  isValid: boolean;
  onOpenSaveModal: () => void;
}

export function ShiftControls({
  startDate,
  pattern,
  onStartDateChange,
  onPatternChange,
  onReset,
  savedRotations,
  selectedRotationId,
  onSelectRotation,
  isLoadingRotations,
  isValid,
  onOpenSaveModal,
}: ShiftControlsProps) {
  const error = validatePattern(pattern);
  const workCount = pattern.filter((p) => p === "work").length;
  const offCount = pattern.filter((p) => p === "off").length;

  const addPill = (type: ShiftType) => {
    if (pattern.length >= 10) return;
    onPatternChange([...pattern, type]);
  };

  const removePill = (index: number) => {
    const next = pattern.filter((_, i) => i !== index);
    onPatternChange(next);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Shift Configuration</h2>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95 sm:px-4"
        >
          ↺ Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Start Date */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="start-date" className="text-sm font-medium text-gray-600">
            Start Date
          </label>
          <DatePicker id="start-date" value={startDate} onChange={onStartDateChange} />
        </div>

        {/* Pattern Builder */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600">
              Rotation Pattern
              <span className="ml-2 text-xs font-normal text-gray-400">({pattern.length}/10)</span>
            </label>
          </div>

          {/* Pill display area */}
          <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            {pattern.length === 0 && (
              <span className="text-xs text-gray-400 italic">
                Click the buttons below to build your pattern…
              </span>
            )}
            {pattern.map((type, idx) => (
              <div
                key={idx}
                className={cn(
                  "group relative flex size-8 items-center justify-center rounded-full px-3 text-xs font-semibold transition",
                  type === "work" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                )}
              >
                <span className="transition group-hover:opacity-0">
                  {type === "work" ? "W" : "O"}
                </span>
                <button
                  type="button"
                  onClick={() => removePill(idx)}
                  className="absolute inset-0 flex items-center justify-center rounded-full p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/20"
                  aria-label={`Remove day ${idx + 1}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Add buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addPill("work")}
              disabled={pattern.length >= 10}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition sm:flex-none",
                pattern.length >= 10
                  ? "cursor-not-allowed bg-emerald-300"
                  : "bg-emerald-500 hover:bg-emerald-600 active:scale-95"
              )}
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/80" />
              Work
            </button>
            <button
              type="button"
              onClick={() => addPill("off")}
              disabled={pattern.length >= 10}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition sm:flex-none",
                pattern.length >= 10
                  ? "cursor-not-allowed bg-rose-300"
                  : "bg-rose-500 hover:bg-rose-600 active:scale-95"
              )}
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/80" />
              Off
            </button>
          </div>
        </div>
      </div>

      {/* Summary / Validation */}
      <div className="mt-5 space-y-1.5">
        {/* Pattern summary */}
        <div className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
          <span className="font-medium">Pattern:</span>{" "}
          <span className="font-semibold text-emerald-600">{workCount} work</span> →{" "}
          <span className="font-semibold text-rose-600">{offCount} off</span> →{" "}
          <span className="text-gray-500">(cycle: {pattern.length} days)</span>
        </div>

        {/* Validation error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
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
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {/* Load / Save row */}
      <div className="mt-5 flex flex-col-reverse items-stretch gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SavedRotationsDropdown
            rotations={savedRotations}
            selectedId={selectedRotationId}
            onSelect={onSelectRotation}
            isLoading={isLoadingRotations}
          />
        </div>

        {isValid && (
          <button
            type="button"
            onClick={onOpenSaveModal}
            className="shrink-0 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
          >
            💾 Save This Rotation
          </button>
        )}
      </div>
    </div>
  );
}
