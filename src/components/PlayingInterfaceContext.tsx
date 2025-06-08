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
import { PlugCard } from "@/game/common/Card";
import { EvaluateStep } from "@/game/evaluate/evaluateStep";
import { evolveCard, evolveTarget } from "@/game/evaluate/evolve";

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
  });

type PlayingInterfaceContextProviderProps = {
  game: CountdownGame;
  gameComplete?: boolean;
  onGameComplete?: () => void;
} & React.PropsWithChildren;
export const PlayingInterfaceContextProvider = (
  props: PlayingInterfaceContextProviderProps
) => {
  const { game, children } = props;
  const [hand, setHand] = useState<CardWithId[]>(
    game.cards.map((c) => {
      return {
        card: c,
        id: uuidv4(),
      };
    })
  );
  const [play, setPlay] = useState<CardWithId[]>([]);
  const [draggingCard, setDraggingCard] = useState<{
    card: CardWithId;
    home: "hand" | "play" | "socket";
  } | null>(null);
  const [sockettedCards, setSockettedCards] = useState<{
    [key: string]: CardWithId;
  }>({});
  const [operatorChoice, setOperatorChoice] = useState<Operator | null>(null);
  const [target, setTarget] = useState<Target>(game.target);
  const [pendingSolutionStep, setPendingSolutionStep] =
    useState<SolutionStep | null>(null);
  const [pendingSolutionStepResult, setPendingSolutionStepResult] =
    useState<EvaluationResult | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistoryStep[]>([]);
  const [complete, setComplete] = useState<boolean>(!!props.gameComplete);

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

  const commitPendingResult = () => {
    if (!pendingSolutionStep || !pendingSolutionStepResult?.success) {
      return;
    }
    //Capture current step for game history
    const historyItem: GameHistoryStep = [
      pendingSolutionStep!,
      pendingSolutionStepResult,
      [[...hand, ...play], sockettedCards, target],
    ];
    setGameHistory([...gameHistory, historyItem]);
    //Process next step
    let victory = false;
    setPlay([]);
    const newHand: CardWithId[] = [
      ...hand,
      ...pendingSolutionStepResult.cards.map((c) => {
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
    Object.keys(sockettedCards).forEach((k) => {
      victory =
        victory ||
        (sockettedCards[k].card.cardType != "socket" &&
          sockettedCards[k].card.value == target.value);
      newSockettedCards[k] = {
        ...sockettedCards[k],
        card: evolveCard(sockettedCards[k].card),
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
  };

  return (
    <PlayingInterfaceContext.Provider value={state}>
      {children}
    </PlayingInterfaceContext.Provider>
  );
};
