"use client";

import { useState, useMemo, useEffect } from "react";
import { ShiftControls } from "@/components/features/shift-controls";
import { YearCalendar } from "@/components/features/year-calendar";
import { Legend } from "@/components/ui/legend";
import { ShiftStats } from "@/components/features/shift-stats";
import { SaveModal } from "@/components/ui/save-modal";
import { SavedRotationsDropdown } from "@/components/ui/saved-rotations-dropdown";
import {
  validatePattern,
  calculateYearStats,
  type ShiftConfig,
  type ShiftType,
} from "@/lib/shift-logic";
import type { SavedRotation } from "@/lib/validations";

const DEFAULT_PATTERN: ShiftType[] = ["work", "work", "off"];

export default function Home() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [pattern, setPattern] = useState<ShiftType[]>(DEFAULT_PATTERN);
  const [savedRotations, setSavedRotations] = useState<SavedRotation[]>([]);
  const [selectedRotationId, setSelectedRotationId] = useState<number | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingRotations, setIsLoadingRotations] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 px-6 py-5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">🗓️ Shifty</h1>
          <p className="mt-1 text-sm text-gray-500">Year-at-a-glance shift rotation calendar</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        {/* Controls */}
        <ShiftControls
          startDate={startDate}
          pattern={pattern}
          onStartDateChange={(value) => {
            setStartDate(value);
            setSelectedRotationId(null); // Clear selection when manually editing
          }}
          onPatternChange={(value) => {
            setPattern(value);
            setSelectedRotationId(null); // Clear selection when manually editing
          }}
        />

        {/* Load Saved Rotations */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <SavedRotationsDropdown
            rotations={savedRotations}
            selectedId={selectedRotationId}
            onSelect={handleLoadRotation}
            isLoading={isLoadingRotations}
          />
        </div>

        {/* Stats */}
        {isValid && (
          <ShiftStats
            workDays={stats.workDays}
            offDays={stats.offDays}
            unassignedDays={stats.unassignedDays}
            totalDays={stats.totalDays}
          />
        )}

        {/* Save Button */}
        {isValid && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsSaveModalOpen(true)}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
            >
              💾 Save This Rotation
            </button>
          </div>
        )}

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

      {/* Save Modal */}
      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSave}
        isLoading={isSaving}
      />
    </div>
  );
}
