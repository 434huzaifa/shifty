"use client";

interface ShiftStatsProps {
  workDays: number;
  offDays: number;
  unassignedDays: number;
  totalDays: number;
}

export function ShiftStats({ workDays, offDays, unassignedDays, totalDays }: ShiftStatsProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm ">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Year Statistics</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        {/* Work Days */}
        <div className="flex flex-col items-center rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-200">
          <span className="text-3xl font-bold text-emerald-600">{workDays}</span>
          <span className="mt-1 text-xs font-medium text-emerald-700">Work Days</span>
        </div>

        {/* Off Days */}
        <div className="flex flex-col items-center rounded-lg bg-rose-50 p-4 ring-1 ring-rose-200">
          <span className="text-3xl font-bold text-rose-600">{offDays}</span>
          <span className="mt-1 text-xs font-medium text-rose-700">Off Days</span>
        </div>

        {/* Unassigned Days */}
        {/* <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4 ring-1 ring-gray-200">
          <span className="text-3xl font-bold text-gray-600">{unassignedDays}</span>
          <span className="mt-1 text-xs font-medium text-gray-700">Unassigned</span>
        </div> */}

        {/* Total Days */}
        {/* <div className="flex flex-col items-center rounded-lg bg-blue-50 p-4 ring-1 ring-blue-200">
          <span className="text-3xl font-bold text-blue-600">{totalDays}</span>
          <span className="mt-1 text-xs font-medium text-blue-700">Total Days</span>
        </div> */}
      </div>
    </div>
  );
}
