import { AddCards } from "./AddCards";
import { EvaluationResult } from "../EvaluationResult";
import { SubtractCards } from "./SubtractCards";
import { MultiplyCards } from "./MultiplyCards";
import { DivideCards } from "./DivideCards";
import { BinarySolutionStep } from "../SolutionStep";
import { PlugCard } from "@/game/common/Card";

function isEvolvingCard(card: PlugCard) {
  if (card.cardType == "alternate") {
    return true;
  }
  if (card.modifier.modifierType == "none") {
    return false;
  }
  return true;
}

export function EvaluateBinaryStep(step: BinarySolutionStep): EvaluationResult {
  if (isEvolvingCard(step.left) && isEvolvingCard(step.right)) {
    return {
      success: false,
      errorReason: "Modifiers are mutually incompatible",
    };
  }

  switch (step.operation) {
    case "+": {
      return AddCards(step.left, step.right);
    }
    case "-": {
      return SubtractCards(step.left, step.right);
    }
    case "*": {
      return MultiplyCards(step.left, step.right);
    }
    case "/": {
      return DivideCards(step.left, step.right);
    }
    default: {
      return {
        errorReason: "Unknown",
        success: false,
      };
    }
  }
}
