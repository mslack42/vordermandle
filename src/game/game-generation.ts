import { Card } from "./common/Card"
import { CountdownGame } from "./common/CountdownGame"
import { Target } from "./common/Target"
import { difficultyAllowance } from "./difficultyAllowance"
import { findHardestSolutions } from "./findHardestSolutions"

const baseSmalls = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]
const baseBigs = [25, 50, 75, 100]
const expertBigs = [12, 37, 62, 87]

export type Nonsense = "incrementOne" |
    "decrementOne" |
    "incrementMany" |
    "reversePlug" |
    "reverseSocket" |
    "splitSocket" |
    "cloneSocket" |
    "triangleSocket" |
    "squareSocket" |
    "rotatePlug" |
    "rotateSocket" |
    "partsSocket" |
    "primeSocket" |
    "alternate" |
    "roundSocket" |
    "bigNumber" |
    "reversePlug2" |
    "rotatePlug2" |
    "doublerPlug" |
    "targetIncrementOne" |
    "targetIncrementMany" |
    "targetDecrementOne" |
    "targetDecrementMany" |
    "targetReverse"

export type GameProfile = {
    bigsCount: 0 | 1 | 2 | 3 | 4,
    useExpertBigs: boolean,
    nonsenseCounts: 0 | 1 | 2 | 3 | 4,
    legalNonsense: Nonsense[],
    difficultyAllowance: number
}

type ShuffleWrap<T> = {
    value: T,
    shuffle: number
}
function shuffle<T>(arr: T[]): T[] {
    const shuffleWraps: ShuffleWrap<T>[] = arr.map(a => {
        return { value: a, shuffle: Math.random() }
    }).sort((a, b) => a.shuffle - b.shuffle)
    return shuffleWraps.map(sw => sw.value)
}
const maxSockets = 1

export function generateGame(profile: GameProfile): CountdownGame {
    const target: Target = {
        value: 0
    }
    const bigs = shuffle(profile.useExpertBigs ? expertBigs : baseBigs).slice(0, profile.bigsCount)
    let allSmalls = shuffle(baseSmalls)
    const smalls = allSmalls.slice(0, 6 - profile.bigsCount)
    allSmalls = allSmalls.slice(6 - profile.bigsCount)
    const numValues = shuffle([...smalls, ...bigs])
    let nonsense = profile.legalNonsense
    let appliedNonsense = 0
    const cards: Card[] = []
    let targetModifierApplied = false
    while (appliedNonsense < profile.nonsenseCounts) {
        nonsense = shuffle(nonsense)
        const chosenNonsense = nonsense.pop()
        if (!chosenNonsense || numValues.length == 0) {
            break
        }
        switch (chosenNonsense) {
            case "alternate": {
                const remainingSmalls = numValues.filter(v => v <= 10)
                if (remainingSmalls.length > 0) {
                    const extraNum = allSmalls.pop()!
                    const chosenSmall = remainingSmalls[0]
                    numValues.splice(numValues.findIndex(x => x == chosenSmall), 1)
                    cards.push({
                        value: chosenSmall,
                        cardType: "alternate",
                        alternate: extraNum
                    })
                    appliedNonsense++
                }
                break
            }
            case "bigNumber": {
                const remainingBigs = numValues.filter(v => v > 10)
                if (remainingBigs.length > 0) {
                    const chosenBig = remainingBigs[0]
                    numValues.splice(numValues.findIndex(x => x == chosenBig), 1)
                    cards.push({
                        value: Math.floor(Math.random() * 988 + 11),
                        cardType: "number",
                        modifier: { modifierType: "none" }
                    })
                    appliedNonsense++
                }
                break
            }
            case "cloneSocket": {
                if (cards.filter(c => c.cardType == "socket").length > maxSockets) {
                    break
                }
                if (numValues.length < 2) {
                    break
                }
                numValues.pop()
                numValues.pop()
                cards.push({
                    cardType: "socket",
                    socketFunction: "clone"
                })
                appliedNonsense++
                break
            }
            case "decrementOne": {
                const remainingBigs = numValues.filter(v => v > 10)
                if (remainingBigs.length > 0) {
                    const chosenBig = remainingBigs[0]
                    numValues.splice(numValues.findIndex(x => x == chosenBig), 1)
                    cards.push({
                        value: chosenBig,
                        cardType: "number",
                        modifier: { modifierType: "increment", incrementBy: -1 }
                    })
                    appliedNonsense++
                }
                break
            }
            case "doublerPlug": {
                const tinies = numValues.filter(v => v > 10)
                if (tinies.length > 0) {
                    const chosenTiny = tinies[0]
                    numValues.splice(numValues.findIndex(x => x == chosenTiny), 1)
                    cards.push({
                        value: chosenTiny,
                        cardType: "number",
                        modifier: { modifierType: "double" }
                    })
                    appliedNonsense++
                }
                break
            }
            case "incrementMany": {
                const nums = numValues
                if (nums.length > 0) {
                    const chosen = nums[0]
                    numValues.splice(numValues.findIndex(x => x == chosen), 1)
                    cards.push({
                        value: chosen,
                        cardType: "number",
                        modifier: { modifierType: "increment", incrementBy: Math.floor(Math.random() * 10 + 1) }
                    })
                    appliedNonsense++
                }
                break
            }
            case "incrementOne": {
                const nums = numValues
                if (nums.length > 0) {
                    const chosen = nums[0]
                    numValues.splice(numValues.findIndex(x => x == chosen), 1)
                    cards.push({
                        value: chosen,
                        cardType: "number",
                        modifier: { modifierType: "increment", incrementBy: 1 }
                    })
                    appliedNonsense++
                }
                break
            }
            case "partsSocket": {
                if (cards.filter(c => c.cardType == "socket").length > maxSockets) {
                    break
                }
                if (numValues.length < 2) {
                    break
                }
                numValues.pop()
                numValues.pop()
                cards.push({
                    cardType: "socket",
                    socketFunction: "parts"
                })
                appliedNonsense++
                break
            }
            case "primeSocket": {
                if (cards.filter(c => c.cardType == "socket").length > maxSockets) {
                    break
                }
                numValues.pop()
                cards.push({
                    cardType: "socket",
                    socketFunction: "prime"
                })
                appliedNonsense++
                break
            }
            case "reversePlug": {
                const nums = numValues
                if (nums.length > 0) {
                    const chosen = nums[0]
                    numValues.splice(numValues.findIndex(x => x == chosen), 1)
                    cards.push({
                        value: chosen,
                        cardType: "number",
                        modifier: { modifierType: "reverse", strength: 1 }
                    })
                    appliedNonsense++
                }
                break
            }
            case "reversePlug2": {
                const nums = numValues
                if (nums.length > 0) {
                    const chosen = nums[0]
                    numValues.splice(numValues.findIndex(x => x == chosen), 1)
                    cards.push({
                        value: chosen,
                        cardType: "number",
                        modifier: { modifierType: "reverse", strength: 2 }
                    })
                    appliedNonsense++
                }
                break
            }
            case "reverseSocket": {
                if (cards.filter(c => c.cardType == "socket").length > maxSockets) {
                    break
                }
                numValues.pop()
                cards.push({
                    cardType: "socket",
                    socketFunction: "reverse"
                })
                appliedNonsense++
                break
            }
            case "rotatePlug": {
                const nums = numValues
                if (nums.length > 0) {
                    const chosen = nums[0]
                    numValues.splice(numValues.findIndex(x => x == chosen), 1)
                    cards.push({
                        value: chosen,
                        cardType: "number",
                        modifier: { modifierType: "rotate", strength: 1 }
                    })
                    appliedNonsense++
                }
                break
            }
            case "rotatePlug2": {
                const nums = numValues
                if (nums.length > 0) {
                    const chosen = nums[0]
                    numValues.splice(numValues.findIndex(x => x == chosen), 1)
                    cards.push({
                        value: chosen,
                        cardType: "number",
                        modifier: { modifierType: "rotate", strength: 2 }
                    })
                    appliedNonsense++
                }
                break
            }
            case "rotateSocket": {
                if (cards.filter(c => c.cardType == "socket").length > maxSockets) {
                    break
                }
                numValues.pop()
                cards.push({
                    cardType: "socket",
                    socketFunction: "rotate"
                })
                appliedNonsense++
                break
            }
            case "roundSocket": {
                if (cards.filter(c => c.cardType == "socket").length > maxSockets) {
                    break
                }
                numValues.pop()
                cards.push({
                    cardType: "socket",
                    socketFunction: "round"
                })
                appliedNonsense++
                break
            }
            case "splitSocket": {
                if (cards.filter(c => c.cardType == "socket").length > maxSockets) {
                    break
                }
                if (numValues.length < 2) {
                    break
                }
                numValues.pop()
                numValues.pop()
                cards.push({
                    cardType: "socket",
                    socketFunction: "split"
                })
                appliedNonsense++
                break
            }
            case "squareSocket": {
                if (cards.filter(c => c.cardType == "socket").length > maxSockets) {
                    break
                }
                numValues.pop()
                cards.push({
                    cardType: "socket",
                    socketFunction: "square"
                })
                appliedNonsense++
                break
            }
            case "targetDecrementMany": {
                if (!targetModifierApplied) {
                    target.modifier = {
                        modifierType: "increment",
                        incrementBy: -Math.floor(1 + Math.random() * 10)
                    }
                    targetModifierApplied = true
                    appliedNonsense++
                }
                break
            }
            case "targetDecrementOne": {
                if (!targetModifierApplied) {
                    target.modifier = {
                        modifierType: "increment",
                        incrementBy: -1
                    }
                    targetModifierApplied = true
                    appliedNonsense++
                }
                break
            }
            case "targetIncrementMany": {
                if (!targetModifierApplied) {
                    target.modifier = {
                        modifierType: "increment",
                        incrementBy: Math.floor(1 + Math.random() * 10)
                    }
                    targetModifierApplied = true
                    appliedNonsense++
                }
                break
            }
            case "targetIncrementOne": {
                if (!targetModifierApplied) {
                    target.modifier = {
                        modifierType: "increment",
                        incrementBy: 1
                    }
                    targetModifierApplied = true
                    appliedNonsense++
                }
                break
            }
            case "targetReverse": {
                if (!targetModifierApplied) {
                    target.modifier = {
                        modifierType: "reverse",
                    }
                    targetModifierApplied = true
                    appliedNonsense++
                }
                break
            }
            case "targetReverse": {
                if (!targetModifierApplied) {
                    target.modifier = {
                        modifierType: "reverse",
                    }
                    targetModifierApplied = true
                    appliedNonsense++
                }
                break
            }
            case "triangleSocket": {
                if (cards.filter(c => c.cardType == "socket").length > maxSockets) {
                    break
                }
                numValues.pop()
                cards.push({
                    cardType: "socket",
                    socketFunction: "triangle"
                })
                appliedNonsense++
                break
            }
        }
    }
    if (target.value == null) {
        target.modifier = {
            modifierType: "none"
        }
    }
    if (numValues.length > 0) {
        numValues.forEach(n => cards.push({
            cardType: "number",
            value: n,
            modifier: { modifierType: "none" }
        }))
    }

    // Definition generated from profile
    // Now to find a target

    let hardestSolutions = findHardestSolutions(cards, target.modifier!, difficultyAllowance)
    if (target.modifier!.modifierType == "reverse") {
        // Weed out some cases that make this much easier
        hardestSolutions = hardestSolutions.filter(s => 
            (s.unmodifiedSolutionValue! % 10 != 0) &&
            (s.unmodifiedSolutionValue!.toString() != s.unmodifiedSolutionValue!.toString().split('').reverse().join(''))
        )
    }
    if (hardestSolutions.length == 0) {
        return generateGame(profile)
    }

    const chosenSolution = hardestSolutions[Math.floor(Math.random() * 0.999 * hardestSolutions.length)]

    if (chosenSolution && chosenSolution.unmodifiedSolutionValue) {
        target.value = chosenSolution.unmodifiedSolutionValue!

        return {
            cards, target, solution: chosenSolution.stepsTaken
        }
    }
    return generateGame(profile)
}
