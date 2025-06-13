import { PlugCard } from "@/game/common/Card";
import { EvaluationResult } from "../EvaluationResult";
import { weaken } from "../weaken";

export function SubtractCards(
  left: PlugCard,
  right: PlugCard,
): EvaluationResult {
  if (left.cardType == "alternate" && right.cardType == "alternate") {
    return {
      success: false,
      errorReason: "Alternate cards are mutually incompatible",
    };
  }
  if (left.value <= right.value) {
    return {
      success: false,
      errorReason: "Negative numbers are not allowed",
    };
  }
  const newValue = left.value - right.value;
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
          modifier: mod,
          value: newValue,
          cardType: "number",
        }),
      ],
    };
  }
}
