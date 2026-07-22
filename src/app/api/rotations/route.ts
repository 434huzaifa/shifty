import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { savedRotations } from "@/db/schema";
import { saveRotationSchema } from "@/lib/validations";
import { desc } from "drizzle-orm";

// POST /api/rotations - Save a new rotation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = saveRotationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { title, startDate, pattern } = validation.data;

    // Insert into database
    const [saved] = await db
      .insert(savedRotations)
      .values({
        title,
        startDate,
        pattern,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Rotation saved successfully",
        data: saved,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving rotation:", error);
    return NextResponse.json({ error: "Failed to save rotation" }, { status: 500 });
  }
}

// GET /api/rotations - Get all saved rotations
export async function GET() {
  try {
    const rotations = await db
      .select()
      .from(savedRotations)
      .orderBy(desc(savedRotations.createdAt));

    return NextResponse.json({ data: rotations });
  } catch (error) {
    console.error("Error fetching rotations:", error);
    return NextResponse.json({ error: "Failed to fetch rotations" }, { status: 500 });
  }
}
