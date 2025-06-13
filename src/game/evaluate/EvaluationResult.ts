import { Card } from "../common/Card";

export type EvaluationResult =
  | {
      success: false;
      errorReason: string;
    }
  | {
      success: true;
      cards: Card[];
    };
