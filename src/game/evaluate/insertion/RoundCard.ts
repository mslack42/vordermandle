import { PlugCard } from "@/game/common/Card";
import { NumberUpperLimit } from "../binary/NumberUpperLimit";
import { EvaluationResult } from "../EvaluationResult";
import { weaken } from "../weaken";

export function RoundCard(inner: PlugCard): EvaluationResult {
  const newValue = Math.round(inner.value / 10) * 10;
  if (newValue > NumberUpperLimit) {
    return {
      success: false,
      errorReason: "That number is a bit too big",
    };
  }
  return {
    success: true,
    cards: [weaken({ ...inner, value: newValue })],
  };
}
