import { CountdownGame } from "@/game-generation/common/CountdownGame";
import {
  createContext,
  SetStateAction,
  useState,
  Dispatch,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Operator } from "./Operator";
import { CardWithId } from "./CardWithId";
import { DragCard } from "./DragCard";
import { Target } from "@/game-generation/common/Target";

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
  target: Target,
  setTarget: Dispatch<SetStateAction<Target>>,
  resetGame: () => void
};
export const PlayingInterfaceContext = createContext<PlayingInterfaceContextState>({
  hand: [],
  play: [],
  sockettedCards: {},
  draggingCard: null,
  operatorChoice: null,
  target: {value:1},
  setHand: () => {},
  setPlay: () => {},
  setSockettedCards: () => {},
  setDraggingCard: () => {},
  setOperatorChoice: () => {},
  setTarget: () => {},
  resetGame: () => {}
});

type PlayingInterfaceContextProviderProps = {
  game: CountdownGame;
} & React.PropsWithChildren;
export const PlayingInterfaceContextProvider = (props: PlayingInterfaceContextProviderProps) => {
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
  const [target, setTarget] = useState<Target>(game.target)

  const resetGame = () => {
    setPlay([])
    setHand(game.cards.map((c) => {
      return {
        card: c,
        id: uuidv4(),
      };
    }))
    setDraggingCard(null)
    setSockettedCards({})
    setOperatorChoice(null)
    setTarget(game.target)
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
    resetGame
  };

  return (
    <PlayingInterfaceContext.Provider value={state}>
      {children}
    </PlayingInterfaceContext.Provider>
  );
};


