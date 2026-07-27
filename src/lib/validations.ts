import { z } from "zod";

// Validation schema for a shift pattern
export const shiftPatternSchema = z
  .array(z.enum(["work", "off"]))
  .min(1, "Minimum 1 day in pattern")
  .max(7, "Maximum 7 days in pattern");

// Validation schema for saving a rotation
export const saveRotationSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  pattern: shiftPatternSchema,
});

// Validation schema for a saved rotation (from database)
export const savedRotationSchema = z.object({
  id: z.number(),
  title: z.string(),
  startDate: z.string(),
  pattern: shiftPatternSchema,
  createdAt: z.string(),
});

export type SaveRotationInput = z.infer<typeof saveRotationSchema>;
export type SavedRotation = z.infer<typeof savedRotationSchema>;
