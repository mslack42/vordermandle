import { PlugCard } from "@/game/common/Card";
import { NumberUpperLimit } from "../binary/NumberUpperLimit";
import { EvaluationResult } from "../EvaluationResult";
import { weaken } from "../weaken";

const maxTriangleInput = 0.5 * (-1 + Math.sqrt(1 + 8 * NumberUpperLimit));

export function TriangleCard(inner: PlugCard): EvaluationResult {
  if (inner.value > maxTriangleInput) {
    return { success: false, errorReason: "That number is a bit too big" };
  }
  return {
    success: true,
    cards: [weaken({ ...inner, value: Math.floor(inner.value * (inner.value + 1) / 2) })],
  };
}
