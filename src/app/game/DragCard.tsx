import { CardWithId } from "./CardWithId";

export type DragCard = null | { card: CardWithId; home: "hand" | "play" | "socket"; };
