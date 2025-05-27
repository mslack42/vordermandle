import { useSortable } from "@dnd-kit/sortable";
import { useContext } from "react";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { CardWithId } from "./CardWithId";
import { CardBox } from "./CardBox";

type SocketBoxProps = {
  socketCard: CardWithId;
};
export function SocketBox(props: SocketBoxProps) {
  const { sockettedCards, draggingCard } = useContext(PlayingInterfaceContext);
  const sockettedCard = sockettedCards["socket" + props.socketCard.id];
  const disableSocket = sockettedCard != null || draggingCard?.card.card.cardType == "socket";
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
        <CardBox
          home="socket"
          card={sockettedCard}
          disabled={draggingCard != null}
          grayed={draggingCard?.card.id == sockettedCard.id} />
      )}
    </div>
  );
}
