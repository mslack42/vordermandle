import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { JSX, useContext } from "react";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { CountdownGame } from "@/game/common/CountdownGame";
import { Nonsense } from "@/game/game-generation";
import { CardDisplay, SocketCardDisplay } from "./CardDisplay";
import { TargetDisplay } from "./TargetDisplay";

export function InfoButton() {
  const { gameDefinition } = useContext(PlayingInterfaceContext);
  const nonsenseList = extractNonsense(gameDefinition);
  if (nonsenseList.length == 0) {
    return <></>
  }
  const explainations = nonsenseList
    .map((n) => mapNonsenseToExplainationData(n))
    .filter((e) => !!e);
  return (
    <Dialog>
      <DialogTrigger className="text-3xl">
        <FontAwesomeIcon icon={faCircleInfo} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nonsense Explainer</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row justify-center">
          <ul className="max-h-96 overflow-auto p-2 flex flex-col gap-5 max-w-72">
            {explainations.map((n) => (
              <li key={n.nonsense} className="w-full">
                <NonsenseExplained explaination={n} />
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function mapNonsenseToExplainationData(
  nonsense: Nonsense,
): NonsenseExplained | undefined {
  switch (nonsense) {
    case "doublerPlug": {
      return {
        nonsense,
        example: (
          <CardDisplay value={2} modifier={{ modifierType: "double" }} />
        ),
        explaination:
          "This card's value will double after each step, until this card has been used in a sum.",
      };
    }
    case "alternate": {
      return {
        nonsense,
        example: <CardDisplay value={6} alternate={7} />,
        explaination:
          "This card's value will alternate after each step. You can win if either value matches the target.",
      };
    }
    case "incrementOne":
    case "incrementMany":
      return {
        nonsense,
        example: (
          <CardDisplay
            value={8}
            modifier={{ modifierType: "increment", incrementBy: 1 }}
          />
        ),
        explaination: `This card's value will increment after each step, until this card is used in a sum.`,
      };
    case "decrementOne":
      return {
        nonsense,
        example: (
          <CardDisplay
            value={9}
            modifier={{ modifierType: "increment", incrementBy: -1 }}
          />
        ),
        explaination: `This card's value will decrement after each step, until this card is used in a sum.`,
      };
    case "cloneSocket": {
      return {
        nonsense,
        example: <SocketCardDisplay socketFn="clone" />,
        explaination: "This card will clone a number card.",
      };
    }
    case "reversePlug": {
      return {
        nonsense,
        example: (
          <CardDisplay
            value={25}
            modifier={{ modifierType: "reverse", strength: 1 }}
          />
        ),
        explaination: `This card's value will be reversed after being used in a sum.`,
      };
    }
    case "reversePlug2": {
      return {
        nonsense,
        example: (
          <CardDisplay
            value={25}
            modifier={{ modifierType: "reverse", strength: 2 }}
          />
        ),
        explaination: `This card's value will be reversed after being used in a sum. The result will also have a reverse-type modifier.`,
      };
    }
    case "splitSocket": {
      return {
        nonsense,
        example: <SocketCardDisplay socketFn="split" />,
        explaination:
          "This card will split a number card into two equal parts.",
      };
    }
    case "partsSocket": {
      return {
        nonsense,
        example: <SocketCardDisplay socketFn="parts" />,
        explaination:
          "This card will replace a number card with cards matching each of its last two digits.",
      };
    }
    case "rotatePlug": {
      return {
        nonsense,
        example: (
          <CardDisplay
            value={75}
            modifier={{ modifierType: "rotate", strength: 1 }}
          />
        ),
        explaination: `This card's value will be rotated after being used in a sum, meaning that its last digit will be moved to become its first digit.`,
      };
    }
    case "rotatePlug2": {
      return {
        nonsense,
        example: (
          <CardDisplay
            value={75}
            modifier={{ modifierType: "rotate", strength: 2 }}
          />
        ),
        explaination: `This card's value will be rotated after being used in a sum, meaning that its last digit will be moved to become its first digit. The result will also have a rotate-type modifier.`,
      };
    }
    case "rotateSocket": {
      return {
        nonsense,
        example: <SocketCardDisplay socketFn="rotate" />,
        explaination:
          "This card will rotate a number card, meaning that its last digit will be moved to become its first digit.",
      };
    }
    case "primeSocket": {
      return {
        nonsense,
        example: <SocketCardDisplay socketFn="prime" />,
        explaination: "This card will return the nth prime. Good luck!",
      };
    }
    case "reverseSocket": {
      return {
        nonsense,
        example: <SocketCardDisplay socketFn="reverse" />,
        explaination: "This card will reverse the value of a number card.",
      };
    }
    case "roundSocket": {
      return {
        nonsense,
        example: <SocketCardDisplay socketFn="round" />,
        explaination: "This card will round a number card to the nearest 10.",
      };
    }
    case "squareSocket": {
      return {
        nonsense,
        example: <SocketCardDisplay socketFn="square" />,
        explaination: "This card will square a number card.",
      };
    }
    case "triangleSocket": {
      return {
        nonsense,
        example: <SocketCardDisplay socketFn="triangle" />,
        explaination: "This card will return the nth triangle number.",
      };
    }
    case "targetIncrementOne":
    case "targetIncrementMany": {
      return {
        nonsense,
        example: (
          <TargetDisplay
            value={123}
            modifier={{ modifierType: "increment", incrementBy: 1 }}
          />
        ),
        explaination: "The target value will increment after each step.",
      };
    }
    case "targetDecrementMany":
    case "targetDecrementOne": {
      return {
        nonsense,
        example: (
          <TargetDisplay
            value={123}
            modifier={{ modifierType: "increment", incrementBy: -1 }}
          />
        ),
        explaination: "The target value will decrement after each step.",
      };
    }
    case "targetReverse": {
      return {
        nonsense,
        example: (
          <TargetDisplay value={123} modifier={{ modifierType: "reverse" }} />
        ),
        explaination: "The target value will reverse after each step.",
      };
    }
  }
  return undefined;
}

type NonsenseExplained = {
  nonsense: Nonsense;
  example: JSX.Element;
  explaination: string;
};

function NonsenseExplained(props: { explaination: NonsenseExplained }) {
  if (props.explaination.nonsense.startsWith("target")) {
    return (
      <div className="w-full flex flex-col justify-between items-center gap-1">
        <div className="scale-75">
          <div>{props.explaination.example}</div>
        </div>
        <p>{props.explaination.explaination}</p>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-row justify-between gap-2 items-center">
      <div className="scale-75">
        <div>{props.explaination.example}</div>
      </div>
      <p>{props.explaination.explaination}</p>
    </div>
  );
}

function extractNonsense(gameDefinition: CountdownGame): Nonsense[] {
  const collectedNonsense: Nonsense[] = gameDefinition.cards
    .filter(
      (c) =>
        !(
          c.cardType == "number" &&
          (c.modifier == null || c.modifier.modifierType == "none")
        ),
    )
    .map((c): Nonsense | undefined => {
      if (c.cardType == "alternate") {
        return "alternate";
      }
      if (c.cardType == "number") {
        switch (c.modifier.modifierType) {
          case "double":
            return "doublerPlug";
          case "increment":
            if (c.modifier.incrementBy > 0) {
              return "incrementOne";
            }
            return "decrementOne";
          case "reverse":
            if (c.modifier.strength > 1) {
              return "reversePlug2";
            }
            return "reversePlug";
          case "rotate":
            if (c.modifier.strength > 1) {
              return "rotatePlug2";
            }
            return "rotatePlug";
        }
      }
      if (c.cardType == "socket") {
        switch (c.socketFunction) {
          case "clone": {
            return "cloneSocket";
          }
          case "parts": {
            return "partsSocket";
          }
          case "prime": {
            return "primeSocket";
          }
          case "reverse": {
            return "reverseSocket";
          }
          case "rotate": {
            return "rotateSocket";
          }
          case "round": {
            return "roundSocket";
          }
          case "split": {
            return "splitSocket";
          }
          case "square": {
            return "squareSocket";
          }
          case "triangle": {
            return "triangleSocket";
          }
        }
      }
    })
    .filter((v) => !!v);
  if (
    gameDefinition.target.modifier &&
    gameDefinition.target.modifier.modifierType != "none"
  ) {
    switch (gameDefinition.target.modifier.modifierType) {
      case "increment": {
        if (gameDefinition.target.modifier.incrementBy > 0) {
          collectedNonsense.push("targetIncrementOne");
        } else {
          collectedNonsense.push("targetDecrementOne");
        }

        break;
      }
      case "reverse": {
        collectedNonsense.push("targetReverse");
      }
    }
  }
  return Array.from(new Set(collectedNonsense));
}
