import {
  DragStartEvent,
  DragEndEvent,
  DndContext,
  DragOverlay,
  useSensor,
  TouchSensor,
  MouseSensor,
  useSensors,
  pointerWithin,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useContext, useState } from "react";
import { HandBox } from "./HandBox";
import { HandCard } from "./HandCard";
import { PlayBox } from "./PlayBox";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { CardWithId } from "./CardWithId";
import {
  CardClickContextProvider,
  CardClickPayload,
} from "./CardClickContextProvider";
import { CardHome } from "./DragCard";

export function CardPlayArea() {
  const {
    hand,
    play,
    draggingCard,
    sockettedCards,
    setDraggingCard,
    setHand,
    setPlay,
    setSockettedCards,
    complete,
  } = useContext(PlayingInterfaceContext);
  const handleDragStart = (event: DragStartEvent) => {
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
  const dropFunction = (
    droppingCard?: CardWithId,
    droppingCardHome?: CardHome,
    targetId?: UniqueIdentifier,
    targetHome?: CardHome
  ) => {
    if (!droppingCard) return;
    let handCards = [...hand];
    let playCards = [...play];
    const socketCards = { ...sockettedCards };
    const currentHome = droppingCardHome;
    const currentId = droppingCard.id;
    if (
      targetId?.toString().startsWith("socket") &&
      (!!socketCards[targetId] || droppingCard.card.cardType == "socket")
    ) {
      setDraggingCard(null);
      return;
    }
    if (
      (targetHome == "play" || targetId == "play") &&
      currentHome != "play" &&
      (playCards.filter((c) => c.card.cardType == "socket").length > 0 ||
        playCards.filter((c) => c.card.cardType != "socket").length > 1 ||
        (droppingCard.card.cardType == "socket" && playCards.length > 0))
    ) {
      setDraggingCard(null);
      return;
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
          socketCards[targetId!.toString()] = droppingCard;
          setSockettedCards(socketCards);
          break;
        }
      }
    } else {
      switch (currentHome) {
        case "hand": {
          handCards = handCards.filter((c) => c.id != currentId);
          break;
        }
        case "play": {
          playCards = playCards.filter((c) => c.id != currentId);
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
          handCards = [...handCards, droppingCard];
          break;
        }
        case "play": {
          playCards = [...playCards, droppingCard];
          break;
        }
        default: {
          switch (targetHome) {
            case "hand": {
              const newIndex = handCards
                .map((c) => c.id)
                .indexOf(targetId!.toString());
              handCards.splice(newIndex, 0, droppingCard);
              break;
            }
            case "play": {
              const newIndex = playCards
                .map((c) => c.id)
                .indexOf(targetId!.toString());
              playCards.splice(newIndex, 0, droppingCard);
              break;
            }
            default: {
              // Socket
              if (!targetId?.toString().startsWith("socket")) {
                setDraggingCard(null);
                return;
              }
              socketCards[targetId!.toString()] = droppingCard;
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
  const handleDragEnd = (event: DragEndEvent) => {
    dropFunction(
      draggingCard?.card,
      draggingCard?.home,
      event.over?.id,
      event.over?.data.current?.home
    );
  };
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { delay: 100, tolerance: 200 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 200 },
  });

  const handleCardClick = (payload: CardClickPayload) => {
    const { card, cardHome } = payload;
    setDraggingCard({ card, home: cardHome });
    setTimeout(() => {
      switch (cardHome) {
        case "play": {
          dropFunction(card, cardHome, "hand", "hand");
          break;
        }
        case "socket": {
          dropFunction(card, cardHome, "hand", "hand");
          break;
        }
        case "hand": {
          if (play.length == 1 && play[0].card.cardType == "socket") {
            dropFunction(card, cardHome, "socket" + play[0].id, "socket");
          } else {
            dropFunction(card, cardHome, "play", "play");
          }
          break;
        }
      }
    }, 100);
  };

  const sensors = useSensors(mouseSensor, touchSensor);
  return (
    <DndContext
      id="cardplaycontextid"
      onDragStart={(evt) => handleDragStart(evt)}
      onDragEnd={(evt) => handleDragEnd(evt)}
      sensors={sensors}
      collisionDetection={pointerWithin}
    >
      <CardClickContextProvider handler={handleCardClick}>
        <div className="w-full flex flex-col gap-2">
          <PlayBox cards={play} />
          <HandBox cards={hand} />
        </div>
        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {!complete && draggingCard != null && (
            <div className="cursor-grab select-none h-25 md:h-30 flex flex-col justify-center">
              <HandCard card={draggingCard.card.card}>
                {draggingCard.card.card.cardType == "socket" &&
                  !!sockettedCards["socket" + draggingCard.card.id] && (
                    <HandCard
                      card={
                        sockettedCards["socket" + draggingCard.card.id].card
                      }
                    ></HandCard>
                  )}
              </HandCard>
            </div>
          )}
        </DragOverlay>
      </CardClickContextProvider>
    </DndContext>
  );
}
