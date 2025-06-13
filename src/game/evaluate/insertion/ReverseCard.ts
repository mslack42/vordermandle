import { PlugCard } from "@/game/common/Card";
import { EvaluationResult } from "../EvaluationResult";

export function ReverseCard(inner: PlugCard): EvaluationResult {
  return {
    success: true,
    cards: [
      {
        ...inner,
        value: Number(String(inner.value).split("").reverse().join("")),
      },
    ],
  };
}
