import { EvaluateBinaryStep } from "./binary/EvaluateBinaryStep"
import { EvaluationResult } from "./EvaluationResult"
import { EvaluateInsertionStep } from "./insertion/EvaluateInsertionStep"
import { SolutionStep } from "./SolutionStep"

export function EvaluateStep(step: SolutionStep): EvaluationResult {
    switch (step.stepType) {
        case "binary": {
            return EvaluateBinaryStep(step)
        }
        case "insertion": {
            return EvaluateInsertionStep(step)
        }
        default: {
            return {
                success: false,
                errorReason: "Unknown step"
            }
        }
    }
}

