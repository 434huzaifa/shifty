"use client";

import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
// import { ShiftControls } from "@/components/features/shift-controls";
import { YearCalendar } from "@/components/features/year-calendar";
import { Legend } from "@/components/ui/legend";
import { ShiftStats } from "@/components/features/shift-stats";
import { SaveModal } from "@/components/ui/save-modal";
import { DayStatusPopup } from "@/components/ui/day-status-popup";
import {
  validatePattern,
  calculateYearStats,
  extendPatternRange,
  type ShiftConfig,
  type ShiftType,
} from "@/lib/shift-logic";
import type { SavedRotation } from "@/lib/validations";
import { useTutorial } from "@/lib/use-tutorial";

const DEFAULT_PATTERN: ShiftType[] = [];
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - 5 + i);

export default function Home() {
  const [startDate, setStartDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [pattern, setPattern] = useState<ShiftType[]>(DEFAULT_PATTERN);
  const [savedRotations, setSavedRotations] = useState<SavedRotation[]>([]);
  const [selectedRotationId, setSelectedRotationId] = useState<number | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingRotations, setIsLoadingRotations] = useState(false);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [popup, setPopup] = useState<{
    date: Date;
    position: { top: number; left: number };
  } | null>(null);
  const { startTour } = useTutorial();

  const parsedStartDate = useMemo(() => {
    const [y, m, d] = startDate.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [startDate]);

  const shiftConfig: ShiftConfig = useMemo(() => {
    return {
      startDate: parsedStartDate,
      pattern,
    };
  }, [parsedStartDate, pattern]);

  const handleDayClick = (date: Date, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const popupWidth = 176;
    const left = Math.min(rect.left, window.innerWidth - popupWidth - 16);

    setPopup({ date, position: { top: rect.bottom + 8, left: Math.max(left, 16) } });
  };

  const handleDayStatusSelect = (type: ShiftType) => {
    if (!popup) return;
    const next = extendPatternRange(shiftConfig, popup.date, type);
    setStartDate(format(next.startDate, "yyyy-MM-dd"));
    setPattern(next.pattern);
    setSelectedRotationId(null);
    setPopup(null);
  };

  const handleResetAll = () => {
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setPattern([]);
    setSelectedRotationId(null);
  };

  const isValid = validatePattern(pattern) === null;

  const stats = useMemo(() => {
    if (!isValid) {
      return { workDays: 0, offDays: 0, unassignedDays: 0, totalDays: 0 };
    }
    return calculateYearStats(year, shiftConfig);
  }, [year, shiftConfig, isValid]);

  const fetchSavedRotations = async () => {
    setIsLoadingRotations(true);
    try {
      const res = await fetch("/api/rotations");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSavedRotations(data.data);
    } catch (error) {
      console.error("Error fetching rotations:", error);
    } finally {
      setIsLoadingRotations(false);
    }
  };

  // Fetch saved rotations on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSavedRotations();
  }, []);

  const handleSave = async (title: string) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          startDate,
          pattern,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }

      // Close modal and refresh list
      setIsSaveModalOpen(false);
      await fetchSavedRotations();
    } catch (error) {
      console.error("Error saving rotation:", error);
      alert("Failed to save rotation. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadRotation = (rotation: SavedRotation) => {
    setSelectedRotationId(rotation.id);
    setStartDate(rotation.startDate);
    setPattern(rotation.pattern);
  };

  const handleReset = () => {
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setPattern([]);
    setSelectedRotationId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 px-4 py-5 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">🗓️ Shifty</h1>
            <p className="mt-1 text-sm text-gray-500">Year-at-a-glance shift rotation calendar</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startTour}
              title="Take a tour"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 active:scale-95"
            >
              Help
            </button>
            <select
              data-tour="year-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Controls */}
        {/* <ShiftControls
          startDate={startDate}
          pattern={pattern}
          onStartDateChange={(value) => {
            setStartDate(value);
            setSelectedRotationId(null);
          }}
          onPatternChange={(value) => {
            setPattern(value);
            setSelectedRotationId(null);
          }}
          onReset={handleReset}
          savedRotations={savedRotations}
          selectedRotationId={selectedRotationId}
          onSelectRotation={handleLoadRotation}
          isLoadingRotations={isLoadingRotations}
          isValid={isValid}
          onOpenSaveModal={() => setIsSaveModalOpen(true)}
        /> */}

        {/* Stats */}
        {isValid && (
          <ShiftStats
            workDays={stats.workDays}
            offDays={stats.offDays}
            unassignedDays={stats.unassignedDays}
            totalDays={stats.totalDays}
          />
        )}



        {/* Legend */}
        <div data-tour="legend">
          <Legend />
        </div>

        {/* Calendar — always shown; days are unmarked until a rotation is set via day-click */}
        <div data-tour="calendar-grid">
          <YearCalendar
            year={year}
            config={shiftConfig}
            onDayClick={handleDayClick}
            onReset={handleResetAll}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/60 px-6 py-4 text-center text-xs text-gray-400">
        Shifty — Shift Rotation Planner
      </footer>

      {/* Save Modal */}
      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSave}
        isLoading={isSaving}
      />

      {/* Day Status Popup */}
      {popup && (
        <DayStatusPopup
          date={popup.date}
          position={popup.position}
          onSelect={handleDayStatusSelect}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}
