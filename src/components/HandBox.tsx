import {
  useSortable,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useContext } from "react";
import { CardBox } from "./CardBox";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { CardWithId } from "./CardWithId";
import { CardClickContext } from "./CardClickContextProvider";

type HandBoxProps = {
  cards: CardWithId[];
  draggedCard?: CardWithId;
};
export function HandBox(props: HandBoxProps) {
  const { complete } = useContext(PlayingInterfaceContext);
  const { setNodeRef } = useSortable({
    id: "hand",
    disabled: complete,
    animateLayoutChanges: () => {
      return true;
    },
  });
  const { draggingCard } = useContext(PlayingInterfaceContext);
  const { handleCardClick } = useContext(CardClickContext);
  return (
    <SortableContext
      items={props.cards.map((c) => c.id)}
      strategy={rectSortingStrategy}
    >
      <div
        className="w-full flex flex-row justify-center gap-1 md:gap-3 border-8 border-dashed border-theme-yellow items-center h-33 md:h-38 px-2 overflow-x-auto *:        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
       [&::-webkit-scrollbar-track]:bg-gray-100
       [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 "
        ref={setNodeRef}
      >
        {props.cards.map((c) => {
          if (c.id == draggingCard?.card.id) {
            return (
              <CardBox card={c} home={"hand"} grayed disabled key={c.id} />
            );
          }
          return (
            <CardBox
              card={c}
              key={c.id}
              home={"hand"}
              disabled={complete}
              onClick={() =>
                handleCardClick({
                  card: c,
                  cardHome: "hand",
                })
              }
            />
          );
        })}
      </div>
    </SortableContext>
  );
}
