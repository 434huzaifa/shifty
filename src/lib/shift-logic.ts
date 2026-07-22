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

/**
 * Validation rules:
 * - Min 2 pills total
 * - Max 10 pills total
 * - Min 1 work pill
 * - Min 1 off pill
 */
export function validatePattern(pattern: ShiftType[]): string | null {
  if (pattern.length < 2) return "Minimum 2 days in pattern";
  if (pattern.length > 10) return "Maximum 10 days in pattern";

  const workCount = pattern.filter((p) => p === "work").length;
  const offCount = pattern.filter((p) => p === "off").length;

  if (workCount < 1) return "Need at least 1 work day";
  if (offCount < 1) return "Need at least 1 off day";

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
