import { EvaluationResult } from "../EvaluationResult";
import { InsertionSolutionStep } from "../SolutionStep";
import { CloneCard } from "./CloneCard";
import { PartsCard } from "./PartsCard";
import { PrimeCard } from "./PrimeCard";
import { ReverseCard } from "./ReverseCard";
import { RotateCard } from "./RotateCard";
import { RoundCard } from "./RoundCard";
import { SplitCard } from "./SplitCard";
import { SquareCard } from "./SquareCard";
import { TriangleCard } from "./TriangleCard";

export function EvaluateInsertionStep(
  step: InsertionSolutionStep,
): EvaluationResult {
  switch (step.outer.socketFunction) {
    case "clone": {
      return CloneCard(step.inner);
    }
    case "parts": {
      return PartsCard(step.inner);
    }
    case "prime": {
      return PrimeCard(step.inner);
    }
    case "reverse": {
      return ReverseCard(step.inner);
    }
    case "rotate": {
      return RotateCard(step.inner);
    }
    case "round": {
      return RoundCard(step.inner);
    }
    case "split": {
      return SplitCard(step.inner);
    }
    case "square": {
      return SquareCard(step.inner);
    }
    case "triangle": {
      return TriangleCard(step.inner);
    }
    default: {
      return {
        success: false,
        errorReason: "Unknown",
      };
    }
  }
}
