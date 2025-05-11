import { AddCards } from "./AddCards";
import { EvaluationResult } from "../EvaluationResult";
import { SubtractCards } from "./SubtractCards";
import { MultiplyCards } from "./MultiplyCards";
import { DivideCards } from "./DivideCards";
import { BinarySolutionStep } from "../SolutionStep";

export function EvaluateBinaryStep(step: BinarySolutionStep): EvaluationResult {
    switch (step.operation) {
        case ("+"): {
            return AddCards(step.left, step.right);
        }
        case ("-"): {
            return SubtractCards(step.left, step.right);
        }
        case ("*"): {
            return MultiplyCards(step.left, step.right);
        }
        case ("/"): {
            return DivideCards(step.left, step.right);
        }
        default: {
            return {
                errorReason: "Unknown",
                success: false
            };
        }
    }
}
