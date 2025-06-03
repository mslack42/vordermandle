import { EvaluationResult } from "@/game-generation/evaluate/EvaluationResult";
import { SolutionStep } from "@/game-generation/evaluate/SolutionStep";
import { useContext } from "react";
import { HandCard } from "./HandCard";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";

export function GameHistory() {
  const { gameHistory } = useContext(PlayingInterfaceContext);
  return (
    <ol className="flex flex-col w-full ">
      {gameHistory.map((gh, i) => (
        <li key={i}>
          <GameHistoryRow
            stepNumber={i + 1}
            step={gh[0]}
            stepResult={gh[1]}
          ></GameHistoryRow>
        </li>
      ))}
    </ol>
  );
}
type GameHistoryRowProps = {
  stepNumber: number;
  step: SolutionStep;
  stepResult: EvaluationResult;
};
function GameHistoryRow(props: GameHistoryRowProps) {
  const { step, stepResult, stepNumber } = props;
  const { rewindToStep } = useContext(PlayingInterfaceContext);
  let lhsParts = [];
  if (step.stepType == "binary") {
    lhsParts = [
      <HandCard card={step.left} key={"left"} />,
      <p key={"op"}>{step.operation}</p>,
      <HandCard card={step.right} key={"right"} />,
    ];
  } else {
    lhsParts = [
      <HandCard card={step.outer} key={"left"}>
        <HandCard card={step.inner} />
      </HandCard>,
    ];
  }
  return (
    <div className="flex flex-row w-full justify-center align-middle scale-75 gap-4">
      <div className="opacity-50 flex flex-row">
        {lhsParts.map((p) => p)}
        <p>=</p>
        {stepResult.success &&
          stepResult.cards.map((c, i) => <HandCard key={i} card={c} />)}
      </div>
      <button onClick={() => rewindToStep(stepNumber)}>Rewind</button>
    </div>
  );
}
