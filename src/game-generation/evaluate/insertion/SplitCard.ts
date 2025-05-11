import { PlugCard } from "@/game-generation/common/Card";
import { EvaluationResult } from "../EvaluationResult";
import { weaken } from "../weaken";

export function SplitCard(inner: PlugCard): EvaluationResult {
    if (inner.value % 2 != 0) {
        return {
            success: false,
            errorReason: "Can't split this into two equal halves"
        };
    }
    const newCard: PlugCard = {
        ...inner,
        value: Math.floor(inner.value / 2)
    };
    return {
        success: true,
        cards: [weaken({ ...newCard }), weaken({ ...newCard })]
    };
}
