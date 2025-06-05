import { PlugCard } from "@/game/common/Card";
import { EvaluationResult } from "../EvaluationResult";

export function CloneCard(inner: PlugCard): EvaluationResult {
    return {
        success: true,
        cards: [{ ...inner }, { ...inner }]
    };
}
