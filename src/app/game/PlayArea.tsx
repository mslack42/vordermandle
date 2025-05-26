"use client";
import { Card } from "@/game-generation/common/Card";
import { CountdownGame } from "@/game-generation/common/CountdownGame";
import {
  closestCenter,
  closestCorners,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createContext, useContext, useState } from "react";
import { HandCard } from "./HandCard";
import { v4 as uuidv4 } from "uuid";
import {
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";

type GamePlayContextState = {
  handCards: CardWithId[];
  tableCards: CardWithId[];
  sockettedCards: {
    [key: string]: CardWithId;
  };
  currentDragTarget: DragTarget | null;
};
const GamePlayContext = createContext<GamePlayContextState>({
  handCards: [],
  tableCards: [],
  sockettedCards: {},
  currentDragTarget: null,
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
export function PlayArea(props: GamePlayProps) {
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
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    const { active, over } = event;
    if (currentDragTarget == null || over?.id == null) {
      return;
    }

    let newCardsInPlay = [...cardsInPlay];
    let newCardsInHand = [...cardsInHand];
    const newSockettedCards = { ...sockettedCards };

    // remove current drag target from its home
    if (currentDragTarget.currentHome == "table") {
      newCardsInPlay = newCardsInPlay.filter(
        (c) => c.id != currentDragTarget!.card.id
      );
    } else if (currentDragTarget.currentHome == "hand") {
      newCardsInHand = newCardsInHand.filter(
        (c) => c.id != currentDragTarget!.card.id
      );
    } else {
      delete newSockettedCards[currentDragTarget!.currentHome];
    }

    // assign current drag target to its new home
    if (over?.id == "table") {
      newCardsInPlay = [...newCardsInPlay, currentDragTarget!.card];
    } else if (over?.id == "hand") {
      newCardsInHand = [...newCardsInHand, currentDragTarget!.card];
    } else if (over?.id != null && over.id.toString().startsWith("socket")) {
      newSockettedCards[over.id!] = currentDragTarget!.card;
    } else if (over?.id != null) {
      // reorder cards
      if (currentDragTarget.currentHome == "hand") {
        setCardsInHand((items) => {
          const oldIndex = items
            .map((c) => c.id)
            .indexOf(active.id.toString()!);
          const newIndex = items.map((c) => c.id).indexOf(over.id.toString()!);
          return arrayMove(items, oldIndex, newIndex);
        });
        setCurrentDragTarget(null);
        return;
      } else if (currentDragTarget.currentHome == "table") {
        setCardsInPlay((items) => {
          const oldIndex = items
            .map((c) => c.id)
            .indexOf(active.id.toString()!);
          const newIndex = items.map((c) => c.id).indexOf(over.id.toString()!);
          return arrayMove(items, oldIndex, newIndex);
        });
        setCurrentDragTarget(null);
        return;
      } else if (currentDragTarget.currentHome.startsWith("socket")) {
      }
    } else {
      // No drag complete - reset
      setCurrentDragTarget(null);
      return;
    }
    setCurrentDragTarget(null);
    setCardsInHand(newCardsInHand);
    setCardsInPlay(newCardsInPlay);
    setSockettedCards(newSockettedCards);
  }

  return (
    <GamePlayContext.Provider
      value={{
        handCards: cardsInHand,
        tableCards: cardsInPlay,
        sockettedCards: sockettedCards,
        currentDragTarget: currentDragTarget,
      }}
    >
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        collisionDetection={closestCenter}
        sensors={sensors}
      >
        <div className="p-2 space-y-2">
          <Zone zoneId="table" itemIds={cardsInPlay.map((c) => c.id)}>
            <div
              id="PlayArea"
              className="h-32 w-full flex flex-row border-white border-2 rounded-2xl justify-center"
            >
              {cardsInPlay.filter(c => c.id != currentDragTarget?.card.id).map((c) => {
                return <GamePlayCard card={c.card} key={c.id} id={c.id} />;
              })}
            </div>
          </Zone>
          <Zone zoneId="hand" itemIds={cardsInHand.map((c) => c.id)}>
            <div
              id="Cards"
              className="h-32 w-full flex flex-row border-white border-2 rounded-2xl justify-center"
            >
              {cardsInHand.filter(c => c.id != currentDragTarget?.card.id).map((c) => (
                <GamePlayCard card={c.card} key={c.id} id={c.id} />
              ))}
            </div>
          </Zone>
        </div>
        <DragOverlay >
        {currentDragTarget?.card != null && (
          <GamePlayCard
            card={currentDragTarget.card.card}
            id={currentDragTarget.card.id}
          />
        )}
        </DragOverlay>
      </DndContext>
    </GamePlayContext.Provider>
  );
}
type GamePlayCardProps = {
  card: Card;
  id: string;
};
function GamePlayCard(props: GamePlayCardProps & React.PropsWithChildren) {
  const { attributes, listeners, setNodeRef, } =
    useSortable({
      id: props.id,
    });
  const interfaceContext = useContext(GamePlayContext);
  const sockettedCardsMap = interfaceContext.sockettedCards;
  const sockettedCard = sockettedCardsMap["socket" + props.id];
  const disableSocket =
    sockettedCard != null ||
    interfaceContext.currentDragTarget?.card.card.cardType == "socket";
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <HandCard card={props.card}>
        {props.card.cardType != "socket" ? (
          <></>
        ) : (
          <Zone
            zoneId={"socket" + props.id}
            disabled={disableSocket}
            itemIds={[sockettedCard?.id].filter((x) => x != null)}
          >
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
  itemIds: string[];
  disabled?: boolean;
};
function Zone(props: ZoneProps & React.PropsWithChildren) {
  const { setNodeRef, over } = useDroppable({
    id: props.zoneId,
    disabled: props.disabled,

  });
  

  return (
    <SortableContext items={props.itemIds} strategy={rectSortingStrategy}>
      <div ref={setNodeRef} className={"h-full w-full " + over?.id == props.zoneId ? "bg-red-500" : ""}>
        {props.children}
      </div>
    </SortableContext>
  );
}
