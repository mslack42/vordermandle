import { createContext } from "react";
import { CardWithId } from "./CardWithId";
import { CardHome } from "./DragCard";

export type CardClickPayload = {
  card: CardWithId;
  cardHome: CardHome;
};
type CardClickContextState = {
  handleCardClick: (payload: CardClickPayload) => void;
};
export const CardClickContext = createContext<CardClickContextState>({
  handleCardClick: () => {},
});
type CardClickProps = {
  handler: (payload: CardClickPayload) => void;
} & React.PropsWithChildren;
export const CardClickContextProvider = (props: CardClickProps) => {
  const state: CardClickContextState = {
    handleCardClick: props.handler,
  };
  return (
    <CardClickContext.Provider value={state}>
      {props.children}
    </CardClickContext.Provider>
  );
};
