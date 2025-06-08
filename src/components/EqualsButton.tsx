import { useContext } from "react";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { HandCard } from "./HandCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { Operator } from "./Operator";

const colours: { [key in Operator]: string } = {
  "+": "bg-theme-yellow hover:bg-theme-yellow-darker",
  "-": "bg-theme-purple hover:bg-theme-purple-darker",
  "*": "bg-theme-green hover:bg-theme-green-darker",
  "/": "bg-theme-red hover:bg-theme-red-darker",
};

export function EqualsButton() {
  const { pendingSolutionStepResult, commitPendingResult, operatorChoice } =
    useContext(PlayingInterfaceContext);

  const disabled =
    !pendingSolutionStepResult || !pendingSolutionStepResult.success;

  return (
    <>
      <EqualsBezel
        onClick={commitPendingResult}
        operatorChoice={operatorChoice}
        disabled={disabled}
      />
      {pendingSolutionStepResult?.success == false ? (
        <StepError errorReason={pendingSolutionStepResult.errorReason} />
      ) : (
        <></>
      )}
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

export function EqualsBezel(props: {
  disabled?: boolean;
  operatorChoice?: Operator | null;
  onClick?: () => void;
}) {
  return (
    <div
      className={
        "h-13 w-13 md:h-18 md:w-18 md:text-lg rounded-xl border-2 border-foreground cursor-pointer " +
        (!!props.operatorChoice ? colours[props.operatorChoice] : colours["/"])
      }
    >
      <button
        className="h-full w-full "
        disabled={props.disabled}
        onClick={props.onClick}
      >
        <FontAwesomeIcon icon={faEquals} />
      </button>
    </div>
  );
}

function StepError(props: { errorReason: string }) {
  return (
    <div className="bg-foreground text-background p-2 w-26 text-wrap text-center text-sm md:text-base">
      <p>{props.errorReason}</p>
    </div>
  );
}
