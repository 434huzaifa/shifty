import { z } from "zod";

// Validation schema for a shift pattern
export const shiftPatternSchema = z
  .array(z.enum(["work", "off"]))
  .min(2, "Minimum 2 days in pattern")
  .max(10, "Maximum 10 days in pattern")
  .refine((pattern) => pattern.some((p) => p === "work"), "Need at least 1 work day")
  .refine((pattern) => pattern.some((p) => p === "off"), "Need at least 1 off day");

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
