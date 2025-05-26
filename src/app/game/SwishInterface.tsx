import { Card } from "@/game-generation/common/Card";
import { CountdownGame } from "@/game-generation/common/CountdownGame";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import {
  createContext,
  SetStateAction,
  useState,
  Dispatch,
  useContext,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { HandCard } from "./HandCard";
import { CSS } from "@dnd-kit/utilities";

type DragCard = null | { card: CardWithId; home: "hand" | "play" | "socket" };
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
};
const PlayingInterfaceContext = createContext<PlayingInterfaceContextState>({
  hand: [],
  play: [],
  sockettedCards: {},
  draggingCard: null,
  setHand: () => {},
  setPlay: () => {},
  setSockettedCards: () => {},
  setDraggingCard: () => {},
});

type ProviderProps = {
  game: CountdownGame;
} & React.PropsWithChildren;
const PlayingInterfaceContextProvider = (props: ProviderProps) => {
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

  const state: PlayingInterfaceContextState = {
    hand,
    setHand,
    play,
    setPlay,
    sockettedCards,
    setSockettedCards,
    draggingCard,
    setDraggingCard,
  };

  return (
    <PlayingInterfaceContext.Provider value={state}>
      {children}
    </PlayingInterfaceContext.Provider>
  );
};

type Props = {
  game: CountdownGame;
};
type CardWithId = {
  card: Card;
  id: string;
};

export function SwishInterface(props: Props) {
  const { game } = props;

  return (
    <>
      <PlayingInterfaceContextProvider game={game}>
        <CardPlayArea />
      </PlayingInterfaceContextProvider>
    </>
  );
}

function CardPlayArea() {
  const {
    hand,
    play,
    draggingCard,
    sockettedCards,
    setDraggingCard,
    setHand,
    setPlay,
    setSockettedCards,
  } = useContext(PlayingInterfaceContext);
  const handleDragStart = (event: DragStartEvent) => {
    console.log(event);
    let cardMatches: CardWithId[] = [];
    switch (event.active.data.current?.home) {
      case "hand": {
        cardMatches = [...hand].filter((c) => c.id == event.active.id);
        break;
      }
      case "play": {
        cardMatches = [...play].filter((c) => c.id == event.active.id);
        break;
      }
      case "socket": {
        cardMatches = Object.values(sockettedCards).filter(
          (c) => c.id == event.active.id
        );
        break;
      }
    }
    if (cardMatches.length == 0) {
      setDraggingCard(null);
      return;
    }
    const card = cardMatches[0];
    setDraggingCard({ card, home: event.active.data.current?.home });
  };
  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event);
    if (!draggingCard) return;
    let handCards = [...hand];
    let playCards = [...play];
    const socketCards = { ...sockettedCards };
    const currentHome = draggingCard.home;
    const currentId = draggingCard.card.id;
    const targetId = event.over?.id;
    const targetHome = event.over?.data.current?.home;
    if (targetId?.toString().startsWith("socket") && !!socketCards[targetId]) {
      setDraggingCard(null)
      return
    }

    if (targetHome == currentHome) {
      switch (currentHome) {
        case "hand": {
          const oldIndex = handCards
            .map((c) => c.id)
            .indexOf(currentId.toString());
          const newIndex = handCards
            .map((c) => c.id)
            .indexOf(targetId!.toString());
          setHand((cs) => {
            return arrayMove(cs, oldIndex, newIndex);
          });
          break;
        }
        case "play": {
          const oldIndex = playCards
            .map((c) => c.id)
            .indexOf(currentId.toString());
          const newIndex = playCards
            .map((c) => c.id)
            .indexOf(targetId!.toString());
          setPlay((cs) => {
            return arrayMove(cs, oldIndex, newIndex);
          });
          break;
        }
        case "socket": {
          if (!targetId?.toString().startsWith("socket")) {
            setDraggingCard(null);
            return;
          }
          const currentKey = Object.entries(socketCards).filter(
            (p) => p[1].id == currentId
          )[0][0];
          delete socketCards[currentKey];
          socketCards[targetId!.toString()] = draggingCard.card;
          setSockettedCards(socketCards);
          break;
        }
      }
    } else {
      switch (currentHome) {
        case "hand": {
          handCards = handCards.filter((c) => c.id != event.active.id);
          break;
        }
        case "play": {
          playCards = playCards.filter((c) => c.id != event.active.id);
          break;
        }
        case "socket": {
          const currentKey = Object.entries(socketCards).filter(
            (p) => p[1].id == currentId
          )[0][0];
          delete socketCards[currentKey];
          break;
        }
      }
      switch (targetId) {
        case "hand": {
          handCards = [...handCards, draggingCard!.card];
          break;
        }
        case "play": {
          playCards = [...playCards, draggingCard!.card];
          break;
        }
        default: {
          switch (targetHome) {
            case "hand": {
              const newIndex = handCards
                .map((c) => c.id)
                .indexOf(targetId!.toString());
              handCards.splice(newIndex, 0, draggingCard!.card);
              break;
            }
            case "play": {
              const newIndex = playCards
                .map((c) => c.id)
                .indexOf(targetId!.toString());
              playCards.splice(newIndex, 0, draggingCard!.card);
              break;
            }
            default: {
              // Socket
              if (!targetId?.toString().startsWith("socket")) {
                setDraggingCard(null);
                return;
              }
              socketCards[targetId!.toString()] = draggingCard!.card;
            }
          }
        }
      }
      setPlay(playCards);
      setHand(handCards);
      setSockettedCards(socketCards);
    }

    setDraggingCard(null);
  };
  return (
    <DndContext
      onDragStart={(evt) => handleDragStart(evt)}
      onDragEnd={(evt) => handleDragEnd(evt)}
    >
      <HandBox cards={hand} />
      <PlayBox cards={play} />
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {draggingCard != null && (
          <div className="cursor-pointer select-none">
            <HandCard card={draggingCard.card.card} >
              {draggingCard.card.card.cardType == "socket" && !!sockettedCards["socket"+draggingCard.card.id] &&
              <HandCard card={sockettedCards["socket"+draggingCard.card.id].card}></HandCard>}
            </HandCard>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

type HandBoxProps = {
  cards: CardWithId[];
  draggedCard?: CardWithId;
};
function HandBox(props: HandBoxProps) {
  const { setNodeRef } = useSortable({
    id: "hand",
  });
  const { draggingCard } = useContext(PlayingInterfaceContext);
  return (
    <SortableContext
      items={props.cards.map((c) => c.id)}
      strategy={rectSortingStrategy}
    >
      <div className="w-full h-28 bg-red-300 flex flex-row" ref={setNodeRef}>
        {props.cards.map((c) => {
          if (c.id == draggingCard?.card.id) {
            return <CardBox card={c} home={"hand"} key={c.id} grayed disabled />;
          }
          return <CardBox card={c} key={c.id} home={"hand"} />;
        })}
      </div>
    </SortableContext>
  );
}

type PlayBoxProps = {
  cards: CardWithId[];
  draggedCard?: CardWithId;
};
function PlayBox(props: PlayBoxProps) {
  const { setNodeRef } = useSortable({
    id: "play",
  });
  const { draggingCard } = useContext(PlayingInterfaceContext);
  return (
    <SortableContext
      items={props.cards.map((c) => c.id)}
      strategy={rectSortingStrategy}
    >
      <div className="w-full h-28 bg-red-300 flex flex-row" ref={setNodeRef}>
        {props.cards.map((c) => {
          if (c.id == draggingCard?.card.id) {
            return <CardBox card={c} home={"hand"} key={c.id} grayed disabled />;
          }
          return <CardBox card={c} key={c.id} home={"play"} />;
        })}
      </div>
    </SortableContext>
  );
}

type CardBoxProps = {
  card: CardWithId;
  home: "hand" | "play" | "socket";
  disabled?: boolean;
  grayed?: boolean
};
function CardBox(props: CardBoxProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.card.id,
      data: {
        home: props.home,
      },
      disabled: props.disabled,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={
        props.grayed ? "cursor-none opacity-50" : "cursor-pointer select-none"
      }
    >
      <HandCard card={props.card.card}>
        {props.card.card.cardType != "socket" ? (
          <></>
        ) : (
          <SocketBox socketCard={props.card} />
        )}
      </HandCard>
    </div>
  );
}

type SocketBoxProps = {
  socketCard: CardWithId;
};
function SocketBox(props: SocketBoxProps) {
  const { sockettedCards, draggingCard } = useContext(PlayingInterfaceContext);
  const sockettedCard = sockettedCards["socket" + props.socketCard.id];
  const disableSocket =
    sockettedCard != null || draggingCard?.card.card.cardType == "socket";
  const { attributes, listeners, setNodeRef } = useSortable({
    id: "socket" + props.socketCard.id,
    disabled: disableSocket,
    data: {
      home: "socket",
    },
  });
  return (
    <div
      className="w-full h-full"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {sockettedCard == null ? (
        <></>
      ) : (
        <CardBox home="socket" card={sockettedCard} disabled={draggingCard != null } grayed={draggingCard?.card.id == sockettedCard.id}/>
      )}
    </div>
  );
}
