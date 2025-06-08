import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDivide,
  faPlus,
  faMinus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Operator } from "./Operator";

const operators: Operator[] = ["+", "-", "*", "/"];
const colours: { [key in Operator]: string } = {
  "+": "bg-theme-yellow hover:bg-theme-yellow-darker",
  "-": "bg-theme-purple hover:bg-theme-purple-darker",
  "*": "bg-theme-green hover:bg-theme-green-darker",
  "/": "bg-theme-red hover:bg-theme-red-darker",
};

type OperatorChoiceProps = {
  operatorChoice: Operator | null;
  setOperatorChoice: (op: Operator | null) => void;
};
export function OperatorChoice(props: OperatorChoiceProps) {
  return (
    <>
      {props.operatorChoice == null ? (
        <div className="h-20 w-20 flex flex-row text-lg flex-wrap justify-between">
          {operators.map((op) => {
            return (
              <button
                key={op}
                className={
                  "h-9 w-9 text-lg cursor-pointer rounded-xl " + colours[op]
                }
                onClick={() => props.setOperatorChoice(op as Operator)}
              >
                <OperatorIcon op={op} />
              </button>
            );
          })}
        </div>
      ) : (
        <div className={"h-18 w-18 flex flex-row text-xl rounded-xl " + colours[props.operatorChoice]}>
          <button
            className="h-full w-full cursor-pointer"
            onClick={() => props.setOperatorChoice(null)}
          >
            <OperatorIcon op={props.operatorChoice}/>
          </button>
        </div>
      )}
    </>
  );
}

function OperatorIcon(props: { op: Operator }) {
  if (props.op == "+") {
    return <FontAwesomeIcon icon={faPlus} />;
  }
  if (props.op == "-") {
    return <FontAwesomeIcon icon={faMinus} />;
  }
  if (props.op == "*") {
    return <FontAwesomeIcon icon={faTimes} />;
  }
  if (props.op == "/") {
    return <FontAwesomeIcon icon={faDivide} />;
  }
  return <></>;
}
