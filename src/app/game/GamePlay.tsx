"use client";
import { Card } from "@/game-generation/common/Card";
import { CountdownGame } from "@/game-generation/common/CountdownGame";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { createContext, useContext, useState } from "react";
import { HandCard } from "./HandCard";
import { v4 as uuidv4 } from "uuid";

type GamePlayContextState = {
  handCards: CardWithId[];
  tableCards: CardWithId[];
  sockettedCards: {
    [key: string]: CardWithId;
  };
  currentDragTarget: DragTarget | null
};
const GamePlayContext = createContext<GamePlayContextState>({
  handCards: [],
  tableCards: [],
  sockettedCards: {},
  currentDragTarget: null
});

type GamePlayProps = {
  game: CountdownGame;
};
type CardWithId = {
  card: Card;
  id: string;
};
type DragTarget = {
  card: CardWithId;
  currentHome: string;
};
export function GamePlay(props: GamePlayProps) {
  const cardsWithIds: CardWithId[] = props.game.cards.map((c) => {
    return {
      card: c,
      id: uuidv4(),
    };
  });
  const [currentDragTarget, setCurrentDragTarget] = useState<DragTarget | null>(
    null
  );
  const [cardsInHand, setCardsInHand] = useState<CardWithId[]>(cardsWithIds);
  const [cardsInPlay, setCardsInPlay] = useState<CardWithId[]>([]);
  const [sockettedCards, setSockettedCards] = useState<{
    [key: string]: CardWithId;
  }>({});

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const targetId = active.id;
    if (targetId == null) {
      return;
    }
    const matchingHandCard = cardsInHand.filter((c) => c.id == targetId);
    if (matchingHandCard.length > 0) {
      setCurrentDragTarget({
        card: matchingHandCard[0],
        currentHome: "hand",
      });      
    }
    const matchingTableCard = cardsInPlay.filter((c) => c.id == targetId);
    if (matchingTableCard.length > 0) {
      setCurrentDragTarget({
        card: matchingTableCard[0],
        currentHome: "table",
      });
          }
    const matchingSocketCard = Object.keys(sockettedCards).filter(
      (k) => sockettedCards[k]?.id == targetId
    );
    if (matchingSocketCard.length > 0) {
      setCurrentDragTarget({
        card: sockettedCards[matchingSocketCard[0]],
        currentHome: matchingSocketCard[0],
      });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;
    console.log(event)
    if (currentDragTarget == null || over?.id == null) {
      return;
    }

    let newCardsInPlay = [...cardsInPlay]
    let newCardsInHand = [...cardsInHand]
    const newSockettedCards = {...sockettedCards}

    // remove current drag target from its home
    if (currentDragTarget.currentHome == "table"){
      newCardsInPlay = newCardsInPlay.filter(c => c.id != currentDragTarget!.card.id)
    } else if (currentDragTarget.currentHome == "hand") {
      newCardsInHand = newCardsInHand.filter(c => c.id != currentDragTarget!.card.id)
    } else {
      delete newSockettedCards[currentDragTarget!.currentHome]
    }

    // assign current drag target to its new home
    if (over?.id == "table") {
      newCardsInPlay = [...newCardsInPlay, currentDragTarget!.card]
    } else if (over?.id == "hand") {
      newCardsInHand = [...newCardsInHand, currentDragTarget!.card]
    } else if (over?.id != null) {
      newSockettedCards[over.id!] = currentDragTarget!.card
    } else {
      // No drag complete - reset
          setCurrentDragTarget(null);
      return
      // if (currentDragTarget.currentHome == "table") {
      //   newCardsInPlay = [...newCardsInPlay, currentDragTarget!.card]
      // } else if (currentDragTarget.currentHome == "hand") {
      //   newCardsInHand = [...cardsInHand, currentDragTarget!.card]
      // } else {
      //   newSockettedCards[currentDragTarget!.currentHome] = currentDragTarget!.card
      // }
    }
    setCurrentDragTarget(null);
    setCardsInHand(newCardsInHand)
    setCardsInPlay(newCardsInPlay)
    setSockettedCards(newSockettedCards)
  }

  return (
    <GamePlayContext.Provider
      value={{
        handCards: cardsInHand,
        tableCards: cardsInPlay,
        sockettedCards: sockettedCards,
        currentDragTarget: currentDragTarget
      }}
    >
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="p-2 space-y-2">
          <Zone zoneId="table">
            <div
              id="PlayArea"
              className="h-32 w-full flex flex-row border-white border-2 rounded-2xl justify-center"
            >
              {cardsInPlay.map((c) => {
                return <GamePlayCard card={c.card} key={c.id} id={c.id} />;
              })}
            </div>
          </Zone>
          <Zone zoneId="hand">
            <div
              id="Cards"
              className="h-32 w-full flex flex-row border-white border-2 rounded-2xl justify-center"
            >
              {cardsInHand.map((c) => (
                <GamePlayCard card={c.card} key={c.id} id={c.id} />
              ))}
            </div>
          </Zone>
        </div>
      </DndContext>
    </GamePlayContext.Provider>
  );
}
type GamePlayCardProps = {
  card: Card;
  id: string;
};
function GamePlayCard(props: GamePlayCardProps & React.PropsWithChildren) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
    const interfaceContext = useContext(GamePlayContext)
  const sockettedCardsMap = interfaceContext.sockettedCards;
  const sockettedCard = sockettedCardsMap[props.id];
  const disableSocket = sockettedCard != null || interfaceContext.currentDragTarget?.card.card.cardType == "socket"
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <HandCard card={props.card}>
        {props.card.cardType != "socket" ? (
          <></>
        ) : (
          <Zone zoneId={props.id} disabled={disableSocket}>
            {sockettedCard == null ? (
              <></>
            ) : (
              <GamePlayCard card={sockettedCard.card} id={sockettedCard.id} />
            )}
          </Zone>
        )}
      </HandCard>
    </div>
  );
}
type ZoneProps = {
  zoneId: string;
  disabled?: boolean 
};
function Zone(props: ZoneProps & React.PropsWithChildren) {
  const { setNodeRef } = useDroppable({
    id: props.zoneId,
    disabled: props.disabled
  });

  return (
    <div ref={setNodeRef} className="h-full w-full">
      {props.children}
    </div>
  );
}
