import { PlugCard } from "@/game/common/Card";
import { EvaluationResult } from "../EvaluationResult";
import { weaken } from "../weaken";

export function SplitCard(inner: PlugCard): EvaluationResult {
    if (inner.value % 2 != 0) {
        return {
            success: false,
            errorReason: "That can't split into two equal halves"
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
