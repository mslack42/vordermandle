import { CountdownGame } from "@/game-generation/common/CountdownGame";
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
import { Target } from "@/game-generation/common/Target";
import { SolutionStep } from "@/game-generation/evaluate/SolutionStep";
import { EvaluationResult } from "@/game-generation/evaluate/EvaluationResult";
import { PlugCard } from "@/game-generation/common/Card";
import { EvaluateStep } from "@/game-generation/evaluate/evaluateStep";
import { evolveCard, evolveTarget } from "@/game-generation/evaluate/evolve";

type GameStateSnapshot = [CardWithId[], {
    [key: string]: CardWithId;
  }, Target]
type GameHistoryStep = [SolutionStep, EvaluationResult, GameStateSnapshot]

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
  gameHistory: GameHistoryStep[],
  rewindToStep: (stepNumber:number) => void
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
    rewindToStep: () => {}
  });

type PlayingInterfaceContextProviderProps = {
  game: CountdownGame;
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
    const [gameHistory, setGameHistory] = useState<GameHistoryStep[]>([])

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
    setGameHistory([])
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

  const commitPendingResult = () => {
    if (!pendingSolutionStep || !pendingSolutionStepResult?.success) {
      return;
    }
    //Capture current step for game history
    const historyItem: GameHistoryStep = [
      pendingSolutionStep!,
      pendingSolutionStepResult,
      [[...hand,...play],sockettedCards,target]
    ]
    setGameHistory([...gameHistory, historyItem])
    //Process next step
    setPlay([]);
    const newHand: CardWithId[] = [
      ...hand,
      ...pendingSolutionStepResult.cards.map((c) => {
        return {
          card: c,
          id: uuidv4(),
        };
      }),
    ].map((c) => {
      return {
        card: evolveCard(c.card),
        id: c.id,
      };
    });
    setHand(newHand);
    const newSockettedCards: { [key: string]: CardWithId } = {};
    Object.keys(sockettedCards).forEach((k) => {
      newSockettedCards[k] = {
        ...sockettedCards[k],
        card: evolveCard(sockettedCards[k].card),
      };
    });
    setSockettedCards(newSockettedCards);
    setTarget(evolveTarget(target));
  };

  const rewindToStep = (stepNumber:number) => {
    if (stepNumber > gameHistory.length) {
      return
    }
    const newGameHistory = gameHistory.slice(0,stepNumber-1)
    const newStateSnapshot = gameHistory[stepNumber-1][2]
    setHand(newStateSnapshot[0])
    setSockettedCards(newStateSnapshot[1])
    setTarget(newStateSnapshot[2])
    setGameHistory(newGameHistory)
  }

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
    rewindToStep
  };

  return (
    <PlayingInterfaceContext.Provider value={state}>
      {children}
    </PlayingInterfaceContext.Provider>
  );
};
