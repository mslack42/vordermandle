import { Operator } from "./Operator";

type OperatorChoiceProps = {
  operatorChoice: Operator | null;
  setOperatorChoice: (op: Operator | null) => void;
};
export function OperatorChoice(props: OperatorChoiceProps) {
  return (
    <>
      {props.operatorChoice == null ? (
        <div className="h-24 w-24 flex flex-row text-lg flex-wrap justify-between">
          {["+", "-", "*", "/"].map((op) => {
            return (
              <button
                key={op}
                className="h-10 w-10 text-lg bg-amber-300 rounded-xl "
                onClick={() => props.setOperatorChoice(op as Operator)}
              >
                <p>{op}</p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="h-24 w-24 flex flex-row text-lg bg-amber-400 rounded-xl">
          <button
            className="h-full w-full"
            onClick={() => props.setOperatorChoice(null)}
          >
            {props.operatorChoice}
          </button>
        </div>
      )}
    </>
  );
}
