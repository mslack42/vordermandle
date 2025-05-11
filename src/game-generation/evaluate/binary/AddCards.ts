import { PlugCard } from "@/game-generation/common/Card";
import { EvaluationResult } from "../EvaluationResult";
import { NumberUpperLimit } from "./NumberUpperLimit";
import { weaken } from "../weaken";

export function AddCards(left: PlugCard, right: PlugCard): EvaluationResult {
    if (left.cardType == "alternate" && right.cardType == "alternate") {
        return {
            success: false,
            errorReason: "Alternate-Alternate is not resolvable"
        };
    }
    const newValue = left.value + right.value;
    if (newValue > NumberUpperLimit) {
        return {
            success: false,
            errorReason: "Numbers don't go that big"
        }
    }
    if (left.cardType == "alternate") {
        return {
            success: true,
            cards: [{
                value: newValue,
                cardType: "alternate",
                alternate: left.alternate,
            }]
        };
    } else if (right.cardType == "alternate") {
        return {
            success: true,
            cards: [{
                value: newValue,
                cardType: "alternate",
                alternate: right.alternate,
            }]
        };
    } else {
        const mod = left.modifier.modifierType != "none" ? left.modifier : right.modifier

        return {
            success: true,
            cards: [weaken({
                value: newValue,
                cardType: "number",
                modifier: mod
            })]
        };
    }
}
