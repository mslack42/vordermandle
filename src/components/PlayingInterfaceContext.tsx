import { CountdownGame } from "@/game/common/CountdownGame";
import {
  createContext,
  SetStateAction,
  useState,
  Dispatch,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Operator } from "./Operator";
import { CardWithId } from "./CardWithId";
import { DragCard } from "./DragCard";
import { Target } from "@/game/common/Target";
import { SolutionStep } from "@/game/evaluate/SolutionStep";
import { EvaluationResult } from "@/game/evaluate/EvaluationResult";
import { Card, PlugCard } from "@/game/common/Card";
import { EvaluateStep } from "@/game/evaluate/evaluateStep";
import { evolveCard, evolveCards, evolveTarget } from "@/game/evaluate/evolve";

type GameStateSnapshot = [
  CardWithId[],
  {
    [key: string]: CardWithId;
  },
  Target
];
type GameHistoryStep = [SolutionStep, EvaluationResult, GameStateSnapshot];

type PlayingInterfaceContextState = {
  hand: CardWithId[];
  setHand: Dispatch<SetStateAction<CardWithId[]>>;
  play: CardWithId[];
  setPlay: Dispatch<SetStateAction<CardWithId[]>>;
  sockettedCards: {
    [key: string]: CardWithId;
  };
  setSockettedCards: Dispatch<
    SetStateAction<{
      [key: string]: CardWithId;
    }>
  >;
  draggingCard: DragCard;
  setDraggingCard: Dispatch<SetStateAction<DragCard>>;
  operatorChoice: Operator | null;
  setOperatorChoice: Dispatch<SetStateAction<Operator | null>>;
  target: Target;
  setTarget: Dispatch<SetStateAction<Target>>;
  resetGame: () => void;
  pendingSolutionStep: SolutionStep | null;
  pendingSolutionStepResult: EvaluationResult | null;
  commitPendingResult: () => void;
  gameHistory: GameHistoryStep[];
  rewindToStep: (stepNumber: number) => void;
  complete: boolean;
  offerClues: boolean;
  cluesGiven: number;
  onClueRequested: () => void;
};
export const PlayingInterfaceContext =
  createContext<PlayingInterfaceContextState>({
    hand: [],
    play: [],
    sockettedCards: {},
    draggingCard: null,
    operatorChoice: null,
    target: { value: 1 },
    setHand: () => {},
    setPlay: () => {},
    setSockettedCards: () => {},
    setDraggingCard: () => {},
    setOperatorChoice: () => {},
    setTarget: () => {},
    resetGame: () => {},
    pendingSolutionStep: null,
    pendingSolutionStepResult: null,
    commitPendingResult: () => {},
    gameHistory: [],
    rewindToStep: () => {},
    complete: false,
    offerClues: false,
    cluesGiven: 0,
    onClueRequested: () => {},
  });

type PlayingInterfaceContextProviderProps = {
  game: CountdownGame;
  gameComplete?: boolean;
  onGameComplete?: () => void;
  offerClues?: boolean;
  cluesGiven?: number;
  onClueRequested?: (c: number) => void;
} & React.PropsWithChildren;
export const PlayingInterfaceContextProvider = (
  props: PlayingInterfaceContextProviderProps
) => {
  const { game, children } = props;
  const { calcedHand, calcedSteps, calcedTarget } = calcInitialCards(
    game,
    props.cluesGiven,
    props.gameComplete
  );
  const [hand, setHand] = useState<CardWithId[]>(calcedHand);
  const [play, setPlay] = useState<CardWithId[]>([]);
  const [draggingCard, setDraggingCard] = useState<{
    card: CardWithId;
    home: "hand" | "play" | "socket";
  } | null>(null);
  const [sockettedCards, setSockettedCards] = useState<{
    [key: string]: CardWithId;
  }>({});
  const [operatorChoice, setOperatorChoice] = useState<Operator | null>(null);
  const [target, setTarget] = useState<Target>(calcedTarget);
  const [pendingSolutionStep, setPendingSolutionStep] =
    useState<SolutionStep | null>(null);
  const [pendingSolutionStepResult, setPendingSolutionStepResult] =
    useState<EvaluationResult | null>(null);
  const [gameHistory, setGameHistory] =
    useState<GameHistoryStep[]>(calcedSteps);
  const [complete, setComplete] = useState<boolean>(!!props.gameComplete);
  const offerClues = !!props.offerClues;
  const [cluesGiven, setCluesGiven] = useState<number>(props.cluesGiven ?? 0);

  const resetGame = () => {
    setPlay([]);
    setHand(
      game.cards.map((c) => {
        return {
          card: c,
          id: uuidv4(),
        };
      })
    );
    setDraggingCard(null);
    setSockettedCards({});
    setOperatorChoice(null);
    setTarget(game.target);
    setGameHistory([]);
  };

  useEffect(() => {
    let currStep: SolutionStep | null = null;
    if (play.length == 1 && play[0].card.cardType == "socket") {
      const sockettedCard = sockettedCards["socket" + play[0].id];
      if (sockettedCard && sockettedCard.card.cardType != "socket") {
        currStep = {
          stepType: "insertion",
          outer: play[0].card,
          inner: sockettedCard.card,
        };
      }
    }
    if (
      play.length == 2 &&
      play.every((c) => c.card.cardType != "socket") &&
      operatorChoice
    ) {
      currStep = {
        stepType: "binary",
        left: play[0].card as PlugCard,
        right: play[1].card as PlugCard,
        operation: operatorChoice,
      };
    }
    setPendingSolutionStep(currStep);
    if (currStep) {
      setPendingSolutionStepResult(EvaluateStep(currStep));
    } else {
      setPendingSolutionStepResult(null);
    }
  }, [operatorChoice, play, sockettedCards]);

  useEffect(() => {
    if (complete && !!props.onGameComplete) {
      props.onGameComplete();
    }
  }, [complete, props]);

  const applyPendingResult = (
    step: SolutionStep | null,
    res: EvaluationResult | null,
    handCards: CardWithId[],
    playCards: CardWithId[],
    socketCards: { [key: string]: CardWithId }
  ) => {
    if (!step || !res?.success) {
      return;
    }
    //Capture current step for game history
    const historyItem: GameHistoryStep = [
      step!,
      res,
      [[...handCards, ...playCards], socketCards, target],
    ];
    setGameHistory([...gameHistory, historyItem]);
    //Process next step
    let victory = false;
    setPlay([]);
    const newHand: CardWithId[] = [
      ...handCards,
      ...res.cards.map((c) => {
        return {
          card: c,
          id: uuidv4(),
        };
      }),
    ];
    victory =
      victory ||
      newHand.some(
        (c) => c.card.cardType != "socket" && c.card.value == target.value
      );
    const evolvedNewHand = newHand.map((c) => {
      return {
        card: evolveCard(c.card),
        id: c.id,
      };
    });
    const newSockettedCards: { [key: string]: CardWithId } = {};
    Object.keys(socketCards).forEach((k) => {
      victory =
        victory ||
        (socketCards[k].card.cardType != "socket" &&
          socketCards[k].card.value == target.value);
      newSockettedCards[k] = {
        ...socketCards[k],
        card: evolveCard(socketCards[k].card),
      };
    });
    const newTarget = evolveTarget(target);

    victory =
      victory ||
      evolvedNewHand.some(
        (c) => c.card.cardType != "socket" && c.card.value == newTarget.value
      ) ||
      Object.values(newSockettedCards).some(
        (v) => v.card.cardType != "socket" && v.card.value == newTarget.value
      );

    setHand(evolvedNewHand);
    setSockettedCards(newSockettedCards);
    setTarget(newTarget);
    setComplete(victory);
  };

  const commitPendingResult = () => {
    applyPendingResult(
      pendingSolutionStep,
      pendingSolutionStepResult,
      hand,
      play,
      sockettedCards
    );
  };

  const rewindToStep = (stepNumber: number) => {
    if (stepNumber > gameHistory.length) {
      return;
    }
    const newGameHistory = gameHistory.slice(0, stepNumber - 1);
    const newStateSnapshot = gameHistory[stepNumber - 1][2];
    setHand(newStateSnapshot[0]);
    setPlay([]);
    setSockettedCards(newStateSnapshot[1]);
    setTarget(newStateSnapshot[2]);
    setGameHistory(newGameHistory);
  };

  const onClueRequested = () => {
    if (props.cluesGiven == gameHistory.length) {
      const step = game.solution![props.cluesGiven];
      let tempHand = [...hand, ...play, ...Object.values(sockettedCards)];
      let matchedIds: string[] = [];
      if (step.stepType == "binary") {
        if (JSON.stringify(step.left) == JSON.stringify(step.right)) {
          matchedIds = tempHand.filter(
            (c) => JSON.stringify(c.card) == JSON.stringify(step.left)
          ).map(c => c.id).slice(0,2)
        } else {
          matchedIds = [
            tempHand.filter(
              (c) => JSON.stringify(c.card) == JSON.stringify(step.left)
            )[0].id,
            tempHand.filter(
              (c) => JSON.stringify(c.card) == JSON.stringify(step.right)
            )[0].id,
          ];
        }
      } else {
        matchedIds = [
          tempHand.filter(
            (c) => JSON.stringify(c.card) == JSON.stringify(step.inner)
          )[0].id,
          tempHand.filter(
            (c) => JSON.stringify(c.card) == JSON.stringify(step.outer)
          )[0].id,
        ];
      }
      tempHand = tempHand.filter((c) => !matchedIds.includes(c.id));
      const res = EvaluateStep(step);
      applyPendingResult(step, res, tempHand, [], {});
      setCluesGiven(cluesGiven + 1);
    }
  };

  useEffect(() => {
    if (props.onClueRequested) {
      props.onClueRequested(cluesGiven);
    }
  }, [cluesGiven, props]);

  const state: PlayingInterfaceContextState = {
    hand,
    setHand,
    play,
    setPlay,
    sockettedCards,
    setSockettedCards,
    draggingCard,
    setDraggingCard,
    operatorChoice,
    setOperatorChoice,
    target,
    setTarget,
    resetGame,
    pendingSolutionStep,
    pendingSolutionStepResult,
    commitPendingResult,
    gameHistory,
    rewindToStep,
    complete,
    offerClues,
    cluesGiven,
    onClueRequested,
  };

  return (
    <PlayingInterfaceContext.Provider value={state}>
      {children}
    </PlayingInterfaceContext.Provider>
  );
};
function calcInitialCards(
  game: CountdownGame,
  cluesGiven: number | undefined,
  gameComplete: boolean | undefined
): { calcedHand: CardWithId[]; calcedSteps: GameHistoryStep[], calcedTarget: Target } {
  let workingHand: Card[] = game.cards;
  const workingSteps: GameHistoryStep[] = [];
  let workingTarget = game.target;
  if (cluesGiven) {
    const filteredSteps = game.solution!.slice(
      0,
      gameComplete ? undefined : cluesGiven
    );
    filteredSteps.forEach((step) => {
      let indices = [];
      switch (step.stepType) {
        case "binary": {
          indices = [
            workingHand.findIndex(
              (c) => JSON.stringify(c) == JSON.stringify(step.left)
            ),
            workingHand.findIndex(
              (c) => JSON.stringify(c) == JSON.stringify(step.right)
            ),
          ];
          break;
        }
        case "insertion": {
          indices = [
            workingHand.findIndex(
              (c) => JSON.stringify(c) == JSON.stringify(step.inner)
            ),
            workingHand.findIndex(
              (c) => JSON.stringify(c) == JSON.stringify(step.outer)
            ),
          ];
          break;
        }
      }
      workingHand = workingHand.filter((_, i) => !indices.includes(i));
      const evaluated = EvaluateStep(step);
      if (!evaluated.success) {
        return;
      }
      workingHand = workingHand.concat(evaluated.cards);
      workingHand = evolveCards(workingHand);
      workingTarget = evolveTarget(workingTarget);
      workingSteps.push([step, evaluated, [[], {}, workingTarget]]);
    });
  }
  const outputHand = workingHand.map((c) => {
    return {
      card: c,
      id: uuidv4(),
    };
  });
  const outputSteps = workingSteps;
  if (outputSteps.length > 0) {
    outputSteps[outputSteps.length - 1][2] = [outputHand, {}, workingTarget];
  }
  return {
    calcedHand: outputHand,
    calcedSteps: outputSteps,
    calcedTarget: workingTarget
  };
}
