import {
  useSortable,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useContext } from "react";
import { CardBox } from "./CardBox";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { CardWithId } from "./CardWithId";

type HandBoxProps = {
  cards: CardWithId[];
  draggedCard?: CardWithId;
};
export function HandBox(props: HandBoxProps) {
  const { setNodeRef } = useSortable({
    id: "hand",
  });
  const { draggingCard } = useContext(PlayingInterfaceContext);
  return (
    <SortableContext
      items={props.cards.map((c) => c.id)}
      strategy={rectSortingStrategy}
    >
      <div
        className="w-full flex flex-row justify-center gap-3 border-8 border-dashed border-theme-yellow items-center h-32 md:h-38"
        ref={setNodeRef}
      >
        {props.cards.map((c) => {
          if (c.id == draggingCard?.card.id) {
            return (
              <CardBox card={c} home={"hand"} grayed disabled key={c.id} />
            );
          }
          return <CardBox card={c} key={c.id} home={"hand"} />;
        })}
      </div>
    </SortableContext>
  );
}
