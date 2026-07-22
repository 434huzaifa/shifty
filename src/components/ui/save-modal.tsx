"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  isLoading?: boolean;
}

export function SaveModal({ isOpen, onClose, onSave, isLoading }: SaveModalProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (title.length > 255) {
      setError("Title is too long");
      return;
    }

    setError("");
    onSave(title.trim());
    setTitle("");
  };

  const handleClose = () => {
    setTitle("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Save Rotation</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="rotation-title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="rotation-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 2-on-1-off Pattern"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              autoFocus
              disabled={isLoading}
            />
            {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition",
                isLoading
                  ? "cursor-not-allowed bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              )}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
