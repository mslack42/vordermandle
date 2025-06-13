import { PlugCard } from "@/game/common/Card";
import { EvaluationResult } from "../EvaluationResult";
import { NumberUpperLimit } from "./NumberUpperLimit";
import { weaken } from "../weaken";

export function MultiplyCards(
  left: PlugCard,
  right: PlugCard,
): EvaluationResult {
  if (left.cardType == "alternate" && right.cardType == "alternate") {
    return {
      success: false,
      errorReason: "Alternate cards are mutually incompatible",
    };
  }
  const newValue = left.value * right.value;
  if (newValue > NumberUpperLimit) {
    return {
      success: false,
      errorReason: "That number is a bit too big",
    };
  }
  if (left.cardType == "alternate") {
    return {
      success: true,
      cards: [
        {
          value: newValue,
          cardType: "alternate",
          alternate: left.alternate,
        },
      ],
    };
  } else if (right.cardType == "alternate") {
    return {
      success: true,
      cards: [
        {
          value: newValue,
          cardType: "alternate",
          alternate: right.alternate,
        },
      ],
    };
  } else {
    const mod =
      left.modifier.modifierType != "none" ? left.modifier : right.modifier;
    return {
      success: true,
      cards: [
        weaken({
          value: newValue,
          cardType: "number",
          modifier: mod,
        }),
      ],
    };
  }
}
