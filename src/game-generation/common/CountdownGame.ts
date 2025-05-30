import { SolutionStep } from "../evaluate/SolutionStep";
import { Card } from "./Card";
import { Target } from "./Target";

export type CountdownGame = {
    target: Target;
    cards: Card[];
    solution?: SolutionStep[]
};
