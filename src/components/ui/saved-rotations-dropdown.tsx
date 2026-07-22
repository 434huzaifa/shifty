"use client";

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

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="saved-rotations" className="text-sm font-medium text-gray-600">
        Load Saved Rotation
      </label>
      <select
        id="saved-rotations"
        value={selectedId ?? ""}
        onChange={handleChange}
        disabled={isLoading || rotations.length === 0}
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
