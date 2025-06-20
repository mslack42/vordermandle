import { PlugCard } from "@/game/common/Card";
import { EvaluationResult } from "../EvaluationResult";
import { weaken } from "../weaken";

export function DivideCards(left: PlugCard, right: PlugCard): EvaluationResult {
  if (left.cardType == "alternate" && right.cardType == "alternate") {
    return {
      success: false,
      errorReason: "Alternate cards are mutually incompatible",
    };
  }
  if (left.value < right.value) {
    return {
      success: false,
      errorReason: "Fractions are not allowed",
    };
  }
  const newValue = Math.floor(left.value / right.value);
  if (newValue * right.value != left.value) {
    return {
      success: false,
      errorReason: "Only integer division allowed",
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
