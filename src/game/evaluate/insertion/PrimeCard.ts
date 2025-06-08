import { PlugCard } from "@/game/common/Card";
import { EvaluationResult } from "../EvaluationResult";
import { primes } from "./primes";
import { weaken } from "../weaken";

export function PrimeCard(inner: PlugCard): EvaluationResult {
    if (inner.value > primes.length) {
        return {
            success: false,
            errorReason: "That number is a bit too big"
        };
    }
    return {
        success: true,
        cards: [weaken({
            ...inner,
            value: primes[inner.value - 1]
        })]
    };
}
