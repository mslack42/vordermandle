import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HandCard } from "./HandCard";
import { SocketBox } from "./SocketBox";
import { CardWithId } from "./CardWithId";

type CardBoxProps = {
  card: CardWithId;
  home: "hand" | "play" | "socket";
  disabled?: boolean;
  grayed?: boolean;
  isSocketted?: boolean;
  onClick?: () => void
};
export function CardBox(props: CardBoxProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.card.id,
      data: {
        home: props.home,
      },
      disabled: props.disabled,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={
        (!props.isSocketted ? "h-25 md:h-30 flex flex-col justify-center " : "") +
        (props.grayed ? "cursor-none opacity-50" : "cursor-grab select-none")
      }
      onClick={props.onClick}
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
