import { useSortable } from "@dnd-kit/sortable";
import { HandCard } from "./HandCard";
import { SocketBox } from "./SocketBox";
import { CardWithId } from "./CardWithId";

type CardBoxProps = {
  card: CardWithId;
  home: "hand" | "play" | "socket";
  disabled?: boolean;
  grayed?: boolean;
  isSocketted?: boolean;
  onClick?: () => void;
};
export function CardBox(props: CardBoxProps) {
  const { attributes, listeners, setNodeRef} =
    useSortable({
      id: props.card.id,
      data: {
        home: props.home,
      },
      disabled: props.disabled,
    });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={
        (!props.isSocketted
          ? "h-25 md:h-30 flex flex-col justify-center "
          : "") +
        (props.grayed ? "cursor-none opacity-50" : " select-none")
      }
      onClick={(e) => {
        e.stopPropagation()
        if (props.onClick){          
          props.onClick()
        }
      }}
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
