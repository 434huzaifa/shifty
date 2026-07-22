"use client";

import { Spinner } from "@/components/ui/spinner";
import type { SavedRotation } from "@/lib/validations";

interface SavedRotationsDropdownProps {
  rotations: SavedRotation[];
  selectedId: number | null;
  onSelect: (rotation: SavedRotation) => void;
  isLoading?: boolean;
}

export function SavedRotationsDropdown({
  rotations,
  selectedId,
  onSelect,
  isLoading,
}: SavedRotationsDropdownProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    const rotation = rotations.find((r) => r.id === id);
    if (rotation) {
      onSelect(rotation);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-600">Load Saved Rotation</label>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <Spinner size="sm" className="text-blue-600" />
          <span className="text-sm text-gray-500">Loading saved rotations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="saved-rotations" className="text-sm font-medium text-gray-600">
        Load Saved Rotation
      </label>
      <select
        id="saved-rotations"
        value={selectedId ?? ""}
        onChange={handleChange}
        disabled={rotations.length === 0}
        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">
          {rotations.length === 0 ? "No saved rotations" : "Select a saved rotation..."}
        </option>
        {rotations.map((rotation) => (
          <option key={rotation.id} value={rotation.id}>
            {rotation.title}
          </option>
        ))}
      </select>
    </div>
  );
}
