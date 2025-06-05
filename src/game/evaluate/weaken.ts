import { Card } from "@/game/common/Card";

export function weaken(card: Card) {
    const newCard = { ...card };
    if (newCard.cardType == "number") {
        if (newCard.modifier.modifierType == "reverse" || newCard.modifier.modifierType == "rotate") {
            newCard.value = apply(newCard.value, newCard.modifier.modifierType)
            newCard.modifier = { ...newCard.modifier }
            newCard.modifier.strength--;
            if (newCard.modifier.strength <= 0) {
                newCard.modifier = {
                    modifierType: "none"
                };
            }
        }
        if (newCard.modifier.modifierType == "double" || newCard.modifier.modifierType == "increment") {
            newCard.modifier = {
                modifierType: "none"
            };
        }
    }
    return newCard;
}

function apply(value: number, modifierType: "reverse" | "rotate"): number {
    if (modifierType == "reverse") {
        return Number(String(value).split('').reverse().join(''))
    } else {
        const original = String(value);
        const last = original.slice(original.length - 1);
        const front = original.slice(0, original.length - 1);
        return Number(last + front)
    }
}

