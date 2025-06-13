import { PlugCard } from "@/game/common/Card";
import { EvaluationResult } from "../EvaluationResult";
import { weaken } from "../weaken";

export function PartsCard(inner: PlugCard): EvaluationResult {
  let parts: number[] = [];
  let remains = inner.value;
  while (remains > 0 && parts.length < 2) {
    parts = [...parts, remains % 10];
    remains = Math.floor(remains / 10);
  }
  if (parts.some((p) => p == 0)) {
    return {
      success: false,
      errorReason: "Cards with 0 are not allowed",
    };
  }
  return {
    success: true,
    cards: parts.map((p) => {
      return weaken({
        ...inner,
        value: p,
      });
    }),
  };
}
