import { cn } from "@/lib/utils";

interface TriangleProps {
  direction: "up" | "down";
  className?: string;
}

export function Triangle({ direction, className }: TriangleProps) {
  return (
    <svg
      viewBox="0 0 10 6"
      width="10"
      height="6"
      className={cn("fill-current", className)}
    >
      <polygon points={direction === "down" ? "0,0 10,0 5,6" : "0,6 10,6 5,0"} />
    </svg>
  );
}
