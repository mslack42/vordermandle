import { Card } from "./common/Card";
import { SolutionStep } from "./evaluate/SolutionStep";

export type PotentialSolution = {
  stepsTaken: SolutionStep[];
  difficultyEstimate: number;
  cards: Card[];
  unmodifiedSolutionValue?: number;
};
export type PotentialSolutionMap = Map<number, PotentialSolution>;
