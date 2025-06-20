import { useSortable } from "@dnd-kit/sortable";
import { useContext } from "react";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { CardWithId } from "./CardWithId";
import { CardBox } from "./CardBox";
import { CardClickContext } from "./CardClickContextProvider";

type SocketBoxProps = {
  socketCard: CardWithId;
};
export function SocketBox(props: SocketBoxProps) {
  const { sockettedCards, draggingCard, complete } = useContext(
    PlayingInterfaceContext,
  );
  const sockettedCard = sockettedCards["socket" + props.socketCard.id];
  const disableSocket =
    sockettedCard != null || draggingCard?.card.card.cardType == "socket";
  const { attributes, listeners, setNodeRef } = useSortable({
    id: "socket" + props.socketCard.id,
    disabled: disableSocket || complete,
    data: {
      home: "socket",
    },
  });
  const { handleCardClick } = useContext(CardClickContext);
  return (
    <div
      className="w-full h-25 md:h-30"
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
          disabled={draggingCard != null || complete}
          isSocketted
          grayed={draggingCard?.card.id == sockettedCard.id}
          onClick={() => {
            handleCardClick({ card: sockettedCard, cardHome: "socket" });
          }}
        />
      )}
    </div>
  );
}
