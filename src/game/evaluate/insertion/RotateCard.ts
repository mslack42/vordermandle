import { PlugCard } from "@/game/common/Card";
import { EvaluationResult } from "../EvaluationResult";

export function RotateCard(inner: PlugCard): EvaluationResult {
  const original = String(inner.value);
  const last = original.slice(original.length - 1);
  const front = original.slice(0, original.length - 1);
  return {
    success: true,
    cards: [
      {
        ...inner,
        value: Number(last + front),
      },
    ],
  };
}
