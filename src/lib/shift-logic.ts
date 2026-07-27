import { differenceInCalendarDays } from "date-fns";

export type ShiftType = "work" | "off";

export interface ShiftConfig {
  startDate: Date;
  pattern: ShiftType[];
}

export type ShiftStatus = "work" | "off" | "none";

/**
 * Determines if a given date falls on a work day or off day
 * based on the rotation configuration.
 *
 * Rotation Logic:
 * - If date < startDate → "none" (unassigned)
 * - Otherwise, compute delta = dayDifference(date, startDate)
 * - index = delta % pattern.length
 * - Return pattern[index] ("work" or "off")
 */
export function getShiftStatus(date: Date, config: ShiftConfig): ShiftStatus {
  const { startDate, pattern } = config;

  if (pattern.length === 0) return "none";

  // Normalize both dates to midnight local to avoid timezone issues
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const normalizedStart = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  if (normalizedDate < normalizedStart) {
    return "none";
  }

  const delta = differenceInCalendarDays(normalizedDate, normalizedStart);
  const index = ((delta % pattern.length) + pattern.length) % pattern.length;

  return pattern[index];
}

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Extends, seeds, or overwrites a shift pattern based on a clicked date.
 * - Empty pattern: seeds a single-day pattern starting at clickedDate.
 * - clickedDate is one day before startDate: unshifts (startDate moves back).
 * - clickedDate is one day after the cycle end: pushes (pattern grows forward).
 * - clickedDate is inside the existing range: overwrites that day's status.
 * Boundary extensions are a no-op once the pattern already has 7 days.
 */
export function extendPatternRange(
  config: ShiftConfig,
  clickedDate: Date,
  newType: ShiftType
): ShiftConfig {
  const { startDate, pattern } = config;
  const date = normalizeDate(clickedDate);

  if (pattern.length === 0) {
    return { startDate: date, pattern: [newType] };
  }

  const normalizedStart = normalizeDate(startDate);
  const cycleEnd = new Date(normalizedStart);
  cycleEnd.setDate(cycleEnd.getDate() + pattern.length - 1);

  const deltaFromStart = differenceInCalendarDays(date, normalizedStart);

  if (deltaFromStart >= 0 && deltaFromStart < pattern.length) {
    const nextPattern = [...pattern];
    nextPattern[deltaFromStart] = newType;
    return { startDate: normalizedStart, pattern: nextPattern };
  }

  if (pattern.length >= 7) {
    return config;
  }

  if (deltaFromStart === -1) {
    return { startDate: date, pattern: [newType, ...pattern] };
  }

  if (differenceInCalendarDays(date, cycleEnd) === 1) {
    return { startDate: normalizedStart, pattern: [...pattern, newType] };
  }

  return config;
}

/**
 * Validation rules:
 * - Min 1 day
 * - Max 7 days
 */
export function validatePattern(pattern: ShiftType[]): string | null {
  if (pattern.length < 1) return "Minimum 1 day in pattern";
  if (pattern.length > 7) return "Maximum 7 days in pattern";

  return null; // valid
}

/**
 * Calculate statistics for a given year and shift configuration.
 * Returns counts of work days, off days, and unassigned days.
 */
export function calculateYearStats(
  year: number,
  config: ShiftConfig
): { workDays: number; offDays: number; unassignedDays: number; totalDays: number } {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const totalDays =
    Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  let workDays = 0;
  let offDays = 0;
  let unassignedDays = 0;

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(year, 0, 1 + i);
    const status = getShiftStatus(date, config);

    if (status === "work") workDays++;
    else if (status === "off") offDays++;
    else unassignedDays++;
  }

  return { workDays, offDays, unassignedDays, totalDays };
}
