import { SocketCard, PlugCard } from "../common/Card";
import { Operation } from "./Operation";

export type InsertionSolutionStep = {
    stepType: "insertion";
    outer: SocketCard;
    inner: PlugCard;
};

export type BinarySolutionStep = {
    stepType: "binary";
    operation: Operation;
    left: PlugCard;
    right: PlugCard;
};

export type SolutionStep = BinarySolutionStep | InsertionSolutionStep;
