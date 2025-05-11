import { PlugCard } from "@/game-generation/common/Card";
import { NumberUpperLimit } from "../binary/NumberUpperLimit";
import { EvaluationResult } from "../EvaluationResult";
import { weaken } from "../weaken";

export function SquareCard(inner: PlugCard): EvaluationResult {
    if (inner.value > Math.sqrt(NumberUpperLimit)) {
        return {
            success: false, errorReason: "Numbers don't get that big"
        };
    }
    return {
        success: true,
        cards: [weaken({ ...inner, value: Math.pow(inner.value, 2) })]
    };
}
