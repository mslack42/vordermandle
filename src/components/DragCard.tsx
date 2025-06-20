import { CardWithId } from "./CardWithId";

export type DragCard = null | {
  card: CardWithId;
  home: CardHome;
};
export type CardHome = "hand" | "play" | "socket"
