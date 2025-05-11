import { Card, NumberCard } from "../common/Card";
import { CardModifier } from "../common/CardModifier";
import { Target } from "../common/Target";

export function evolveCards(cards: Card[]) {
    return cards.map(c => {
        evolveCard(c)
    })
}

function evolveCard(c: Card): Card {
    switch (c.cardType) {
        case "alternate": {
            return {
                cardType: "alternate",
                value: c.alternate,
                alternate: c.value
            }
        }
        case "socket": {
            return c
        }
        case "number": {
            return evolveNumberCard(c)
        }
    }
}

function evolveNumberCard(c: NumberCard): Card {
    const modifier: CardModifier = c.modifier
    switch (modifier.modifierType) {
        case "increment": {
            return {
                ...c,
                value: c.value + modifier.incrementBy
            }
        }
        case "double": {
            return {
                ...c,
                value: c.value * 2
            }
        }
        default: {
            return c
        }
    }
}

export function evolveTarget(target: Target): Target {
    if (target.modifier == null) {
        return target
    }
    switch (target.modifier!.modifierType) {
        case "increment": {
            return {
                ...target,
                value: target.value + target.modifier.incrementBy
            }
        }
        case "reverse": {
            return {
                ...target,
                value: Number(String(target.value).split('').reverse().join(''))
            }
        }
        case "rotate": {
            const original = String(target.value);
            const last = original.slice(original.length - 1);
            const front = original.slice(0, original.length - 1);
            return {
                ...target,
                value: Number(last + front)
            }
        }
        default: {
            return target
        }
    }
}