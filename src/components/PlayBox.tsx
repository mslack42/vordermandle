import {
  useSortable,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useContext, useEffect } from "react";
import { CardBox } from "./CardBox";
import { EqualsButton } from "./EqualsButton";
import { OperatorChoice } from "./OperatorChoice";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { CardWithId } from "./CardWithId";
import { CardClickContext } from "./CardClickContextProvider";

type PlayBoxProps = {
  cards: CardWithId[];
};
export function PlayBox(props: PlayBoxProps) {
  const {
    draggingCard,
    operatorChoice,
    setOperatorChoice,
    sockettedCards,
    complete,
  } = useContext(PlayingInterfaceContext);
  const { setNodeRef } = useSortable({
    id: "play",
    disabled: complete,
  });
  const { handleCardClick } = useContext(CardClickContext);
  let cardComponents = props.cards.map((c) => {
    if (c.id == draggingCard?.card.id) {
      return <CardBox card={c} home={"play"} key={c.id} grayed disabled />;
    }
    return (
      <CardBox
        card={c}
        key={c.id}
        home={"play"}
        disabled={complete}
        onClick={() => handleCardClick({ card: c, cardHome: "play" })}
      />
    );
  });
  if (
    props.cards.length == 2 &&
    props.cards.every((c) => c.card.cardType != "socket")
  ) {
    cardComponents = [
      cardComponents[0],
      <OperatorChoice
        key="op"
        setOperatorChoice={(op) => setOperatorChoice(op)}
        operatorChoice={operatorChoice}
      />,
      cardComponents[1],
    ];
    if (operatorChoice) {
      cardComponents.push(<EqualsButton key="eq" />);
    }
  } else if (
    props.cards.length == 1 &&
    props.cards[0].card.cardType == "socket" &&
    sockettedCards["socket" + props.cards[0].id] != null
  ) {
    cardComponents.push(<EqualsButton key="eq" />);
  }
  useEffect(() => {
    if (operatorChoice != null && cardComponents.length < 2) {
      setOperatorChoice(null);
    }
  }, [cardComponents.length, operatorChoice, setOperatorChoice]);

  return (
    <SortableContext
      items={props.cards.map((c) => c.id)}
      strategy={horizontalListSortingStrategy}
    >
      <div
        className="w-full h-32 md:h-38 flex flex-row justify-center gap-3 border-8 border-dashed border-theme-green items-center"
        ref={setNodeRef}
      >
        {cardComponents}
        {complete && (
          <p className="text-3xl text-theme-green select-none">WINNER!</p>
        )}
      </div>
    </SortableContext>
  );
}
