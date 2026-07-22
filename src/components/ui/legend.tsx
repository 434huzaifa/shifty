export function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-block h-4 w-4 rounded-full bg-emerald-500" />
        <span className="text-sm font-medium text-gray-700">Work Day</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block h-4 w-4 rounded-full bg-rose-500" />
        <span className="text-sm font-medium text-gray-700">Off Day</span>
      </div>
      {/* <div className="flex items-center gap-2">
        <span className="inline-block h-4 w-4 rounded-full border border-gray-300 bg-gray-100" />
        <span className="text-sm font-medium text-gray-700">Unassigned</span>
      </div> */}
    </div>
  );
}
