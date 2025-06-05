import { Card, PlugCard } from "./common/Card";
import { TargetModifier } from "./common/TargetModifier";
import { EvaluateStep } from "./evaluate/evaluateStep";
import { EvaluationResult } from "./evaluate/EvaluationResult";
import { InsertionSolutionStep, SolutionStep } from "./evaluate/SolutionStep";
import { PotentialSolution, PotentialSolutionMap } from "./PotentialSolution";
import { difficultyAllowance } from "./difficultyAllowance";
import { evolveCards } from "./evaluate/evolve";


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
            const evolvedNextSteps: PotentialSolution[] = nextSteps.map(ns => {
                return {
                    ...ns,
                    cards: evolveCards(ns.cards),
                }
            })
            // Collect the pre-evolution cards
            for (const sol of nextSteps) {
                const solutionValues = [...sol.cards]
                    .filter(c => c.cardType != "socket")
                    .map(c => c.value)
                    .filter(v => v >= 100 && v <= 999)
                    .map(v => unmodifyTarget(v, targetModifier, sol.stepsTaken.length));
                for (const s of solutionValues) {
                    const currentMapVal = map.get(s);
                    if (!currentMapVal || currentMapVal.difficultyEstimate > sol.difficultyEstimate) {
                        map.set(s, { ...sol, unmodifiedSolutionValue: s });
                    }
                }
            }
            // Collect the post-evolution cards and iterate on those
            for (const sol of evolvedNextSteps) {
                const solutionValues = [...sol.cards]
                    .filter(c => c.cardType != "socket")
                    .map(c => c.value)
                    .filter(v => v >= 100 && v <= 999)
                    .map(v => unmodifyTarget(v, targetModifier, sol.stepsTaken.length));
                for (const s of solutionValues) {
                    const currentMapVal = map.get(s);
                    if (!currentMapVal || currentMapVal.difficultyEstimate > sol.difficultyEstimate) {
                        map.set(s, { ...sol, unmodifiedSolutionValue: s });
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
                difficultyEstimate: root.difficultyEstimate + difficultyOfStep(step, root.stepsTaken, res),
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
                difficultyEstimate: root.difficultyEstimate + difficultyOfStep(step, root.stepsTaken, res),
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
            return [null, []];
        }
    }
    ).filter(x => x[0] != null) as [SolutionStep, Card[]][];
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
function difficultyOfStep(step: SolutionStep, stepsTaken: SolutionStep[], res: EvaluationResult): number {
    if (!res.success) {
        return 0
    }
    // These weightings are all pulled out of thin air
    switch (step.stepType) {
        case "insertion": {
            switch (step.outer.socketFunction) {
                case "clone":
                    return 1.2 + stepsTaken.length * 0.05
                case "parts":
                    const numberSize = step.inner.value.toString().length
                    if (numberSize == 1) {
                        return 0.1
                    }
                    return 1 + (numberSize - 1) * 0.25 + stepsTaken.length * 0.05
                case "prime":
                    if (step.inner.value > 10) {
                        return 1.6
                    }
                    return 1.1
                case "reverse": {
                    const str = step.inner.value.toString()
                    if (str == str.split('').reverse().join('')) {
                        return 0.1
                    }
                    return 1.2 + stepsTaken.length * 0.05
                }
                case "rotate": {
                    const numberSize = step.inner.value.toString().length
                    if (numberSize == 1) {
                        return 0.1
                    }
                    if (numberSize == 2) {
                        return 1.2
                    }
                    return 1.5 + stepsTaken.length * 0.05
                }
                case "round": {
                    if (step.inner.value % 10 == 0) {
                        return 0.1
                    }
                    return 1.05
                }
                case "split": {
                    return 1.15
                }
                case "square": {
                    if (step.inner.value < 16) {
                        return 1.1
                    }
                    return 1.25
                }
                case "triangle": {
                    if (step.inner.value < 10) {
                        return 1.15
                    }
                    return 1.35
                }
            }
        }
        case "binary": {
            const resultingCard = res.cards[0];
            if (resultingCard.cardType == "socket") {
                return 0
            }

            let diff = 0
            if (step.operation == "+" || step.operation == "-") {
                diff = 0.9
            } else if (step.operation == "*") {
                const easyMult = [2, 4, 5, 10, 20, 100]
                if (easyMult.includes(step.left.value) || easyMult.includes(step.right.value)) {
                    diff = 0.7
                } else {
                    diff = 1
                }
            } else if (step.operation == "/") {
                const easyDiv = [2, 10]
                if (easyDiv.includes(step.right.value)) {
                    diff = 0.91
                } else {
                    diff = 1.11
                }
            }
            if (step.left.cardType == "alternate") {
                diff += 0.12
            } else {
                switch (step.left.modifier.modifierType) {
                    case "double":
                    case "increment": {
                        diff += 0.11
                        break
                    }
                    case "none": {
                        diff += 0.05
                        break
                    }
                    case "reverse": {
                        diff += 0.06 * resultingCard.value.toString().length
                        break
                    }
                    case "rotate": {
                        diff += 0.08 * resultingCard.value.toString().length
                        break
                    }
                }
            }
            if (!(step.left.cardType == "number" && step.left.modifier.modifierType == "none")) {
                return diff
            }
            if (step.right.cardType == "alternate") {
                diff += 0.12
            } else {
                switch (step.right.modifier.modifierType) {
                    case "double":
                    case "increment": {
                        diff += 0.11
                        break
                    }
                    case "none": {
                        diff += 0.05
                        break
                    }
                    case "reverse": {
                        diff += 0.06 * resultingCard.value.toString().length
                        break
                    }
                    case "rotate": {
                        diff += 0.08 * resultingCard.value.toString().length
                        break
                    }
                }
            }
            return diff
        }
    }
}

