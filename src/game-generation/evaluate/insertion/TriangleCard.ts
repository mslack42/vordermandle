import { PlugCard } from "@/game-generation/common/Card";
import { NumberUpperLimit } from "../binary/NumberUpperLimit";
import { EvaluationResult } from "../EvaluationResult";
import { weaken } from "../weaken";

const maxTriangleInput = 0.5 * (-1 + Math.sqrt(1 + 8 * NumberUpperLimit));

export function TriangleCard(inner: PlugCard): EvaluationResult {
    if (inner.value > maxTriangleInput) {
        return { success: false, errorReason: "Numbers don't get that big" };
    }
    return {
        success: true,
        cards: [weaken({ ...inner, value: Math.pow(inner.value, 2) })]
    };
}
