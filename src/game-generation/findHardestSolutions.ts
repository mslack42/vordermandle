import { Card, PlugCard } from "./common/Card";
import { TargetModifier } from "./common/TargetModifier";
import { EvaluateStep } from "./evaluate/evaluateStep";
import { EvaluationResult } from "./evaluate/EvaluationResult";
import { SolutionStep } from "./evaluate/SolutionStep";
import { PotentialSolution, PotentialSolutionMap } from "./PotentialSolution";
import { difficultyAllowance } from "./difficultyAllowance";


export function findHardestSolutions(cards: Card[], targetModifier: TargetModifier): PotentialSolution[] {
    const collectedSolutionMap = new Map<number, PotentialSolution>();
    // Collect the 'gimme' solutions where we start with the answer
    cards.forEach(c => {
        if (c.cardType == "number" || c.cardType == "alternate") {
            if (c.value >= 100) {
                collectedSolutionMap.set(
                    c.value,
                    {
                        stepsTaken: [],
                        difficultyEstimate: 0,
                        cards: [...cards],
                        unmodifiedSolutionValue: c.value
                    }
                );
            }
        }
    });

    collectSolutions(collectedSolutionMap, {
        stepsTaken: [],
        difficultyEstimate: 0,
        cards: cards
    }, targetModifier);

    const solutionsList = Array.from(collectedSolutionMap.values());
    const hardestDifficulty = Math.max(...solutionsList.map(s => s.difficultyEstimate));
    const minDiff = hardestDifficulty - difficultyAllowance;
    const hardestAnswers = solutionsList.filter(s => s.difficultyEstimate > minDiff);

    return hardestAnswers;
}

function collectSolutions(
    map: PotentialSolutionMap, root: PotentialSolution, targetModifier: TargetModifier) {
    if (root.cards.length < 2) {
        return;
    }
    for (let i = 0; i < root.cards.length - 1; i++) {
        for (let j = i + 1; j < root.cards.length; j++) {
            const arg1 = root.cards[i];
            const arg2 = root.cards[j];
            const others = [...root.cards];
            others.splice(j, 1);
            others.splice(i, 1);
            const nextSteps: PotentialSolution[] = getNextPossibleSteps(
                arg1,
                arg2,
                others,
                root
            );
            for (const sol of nextSteps) {
                const solutionValues = [...sol.cards]
                    .filter(c => c.cardType != "socket")
                    .map(c => c.value)
                    .filter(v => v >= 100 && v <= 999)
                    .map(v => unmodifyTarget(v, targetModifier, sol.stepsTaken.length));
                for (const s of solutionValues) {
                    const currentMapVal = map.get(s);
                    if (!currentMapVal || currentMapVal.difficultyEstimate > sol.difficultyEstimate) {
                        map.set(s, {...sol, unmodifiedSolutionValue: s});
                    }
                }
                collectSolutions(map, {
                    ...sol
                }, targetModifier);
            }
        }

    }
}
function getNextPossibleSteps(arg1: Card, arg2: Card, others: Card[], root: PotentialSolution): PotentialSolution[] {
    if (arg1.cardType == arg2.cardType && arg1.cardType !== "number") {
        return [];
    }
    if (arg1.cardType == "socket" && arg2.cardType != "socket") {
        const step: SolutionStep = { stepType: "insertion", outer: arg1, inner: arg2 };
        const res = EvaluateStep(step);
        if (res.success) {
            return [{
                cards: [...others, ...res.cards],
                // TODO implement difficulty estimate correctly
                difficultyEstimate: root.difficultyEstimate + 1,
                stepsTaken: [...root.stepsTaken, step],
            }];
        } else {
            return [];
        }
    }
    if (arg2.cardType == "socket" && arg1.cardType != "socket") {
        const step: SolutionStep = { stepType: "insertion", outer: arg2, inner: arg1 };
        const res = EvaluateStep(step);
        if (res.success) {
            return [{
                cards: [...others, ...res.cards],
                // TODO implement difficulty estimate correctly
                difficultyEstimate: root.difficultyEstimate + 1,
                stepsTaken: [...root.stepsTaken, step],
            }];
        } else {
            return [];
        }
    }
    const nextSteps: SolutionStep[] = [
        { stepType: "binary", operation: "+", left: arg1 as PlugCard, right: arg2 as PlugCard },
        { stepType: "binary", operation: "-", left: arg1 as PlugCard, right: arg2 as PlugCard },
        { stepType: "binary", operation: "-", left: arg2 as PlugCard, right: arg1 as PlugCard },
        { stepType: "binary", operation: "*", left: arg1 as PlugCard, right: arg2 as PlugCard },
        { stepType: "binary", operation: "/", left: arg1 as PlugCard, right: arg2 as PlugCard },
        { stepType: "binary", operation: "/", left: arg2 as PlugCard, right: arg1 as PlugCard }
    ];
    const nextEvaluations: [SolutionStep, Card[]][] = nextSteps.map(ns => {
        const ev: EvaluationResult = EvaluateStep(ns);
        if (ev.success) {
            return [ns, ev.cards];
        } else {
            return null;
        }
    }
    ).filter(x => x != null);
    const nextPotentials: PotentialSolution[] = nextEvaluations.map(p => {
        const [step, newCards] = p;
        return {
            cards: [...others, ...newCards],
            // TODO
            difficultyEstimate: root.difficultyEstimate + 1,
            stepsTaken: [...root.stepsTaken, step]
        };
    });
    return nextPotentials;
}
function unmodifyTarget(v: number, targetModifier: TargetModifier, steps: number): number {
    if (!targetModifier) {
        return v
    }
    switch (targetModifier.modifierType) {
        case "none": {
            return v;
        }
        case "increment": {
            return v - steps * targetModifier.incrementBy;
        }
        case "rotate": {
            const unrotate = (n: number) => {
                const head = String(n).substring(0, 1);
                const tail = String(n).substring(1);
                return Number(tail + head);
            };
            let val = v;
            for (let i = 0; i < steps; i++) {
                val = unrotate(val);
            }
            return val;
        }
        case "reverse": {
            if (steps % 2 == 0) {
                return v;
            }
            else {
                return Number(String(v).split('').reverse().join(''));
            }
        }
    }
}
