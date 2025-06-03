import { useContext } from "react";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { HandCard } from "./HandCard";

export function EqualsButton() {
  const { pendingSolutionStepResult, commitPendingResult } = useContext(
    PlayingInterfaceContext
  );

  const disabled =
    !pendingSolutionStepResult || !pendingSolutionStepResult.success;

  return (
    <>
      <div
        className={
          "h-24 w-24 text-lg rounded-xl " +
          (disabled ? "bg-gray-200 text-black" : "bg-green-400")
        }
      >
        <button
          className="h-full w-full "
          disabled={disabled}
          onClick={commitPendingResult}
        >
          {pendingSolutionStepResult?.success == false
            ? pendingSolutionStepResult.errorReason
            : "="}
        </button>
      </div>
      {pendingSolutionStepResult?.success ? (
        pendingSolutionStepResult.cards.map((c, i) => {
          return (
            <div key={"pending" + i} className="opacity-50">
              <HandCard card={c}></HandCard>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
}
