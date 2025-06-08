import { EvaluationResult } from "@/game/evaluate/EvaluationResult";
import { SolutionStep } from "@/game/evaluate/SolutionStep";
import { useContext } from "react";
import { HandCard } from "./HandCard";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { OperatorBezel } from "./OperatorChoice";
import { EqualsBezel } from "./EqualsButton";

export function GameHistory() {
  const { gameHistory } = useContext(PlayingInterfaceContext);
  return (
    <ol
      className="flex flex-col w-full h-full overflow-y-auto 
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 "
    >
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
  const { rewindToStep, cluesGiven } = useContext(PlayingInterfaceContext);
  let lhsParts = [];
  if (step.stepType == "binary") {
    lhsParts = [
      <HandCard card={step.left} key={"left"} />,
      <OperatorBezel key="op" operatorChoice={step.operation} disabled />,
      <HandCard card={step.right} key={"right"} />,
    ];
  } else {
    lhsParts = [
      <HandCard card={step.outer} key={"left"}>
        <HandCard card={step.inner} />
      </HandCard>,
    ];
  }
  const isAClue = cluesGiven >= stepNumber
  return (
    <div className="flex flex-row w-full justify-center items-center scale-75 gap-4">
      <div className="opacity-50 flex flex-row items-center gap-2">
        {lhsParts.map((p) => p)}
        <EqualsBezel
          operatorChoice={step.stepType == "binary" ? step.operation : null}
          disabled
        />
        {stepResult.success &&
          stepResult.cards.map((c, i) => <HandCard key={i} card={c} />)}
      </div>
      {!isAClue && (
        <button
          onClick={() => rewindToStep(stepNumber)}
          className="rounded-xl bg-theme-red border-2 border-foreground h-9 w-9 cursor-pointer"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      )}
    </div>
  );
}
