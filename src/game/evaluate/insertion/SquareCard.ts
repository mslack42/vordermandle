import { PlugCard } from "@/game/common/Card";
import { NumberUpperLimit } from "../binary/NumberUpperLimit";
import { EvaluationResult } from "../EvaluationResult";
import { weaken } from "../weaken";

export function SquareCard(inner: PlugCard): EvaluationResult {
    if (inner.value > Math.sqrt(NumberUpperLimit)) {
        return {
            success: false, errorReason: "That number is a bit too big"
        };
    }
    return {
        success: true,
        cards: [weaken({ ...inner, value: Math.pow(inner.value, 2) })]
    };
}
