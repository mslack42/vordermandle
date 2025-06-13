import { CardModifier } from "./CardModifier";

export type NumberCard = {
  cardType: "number";
  value: number;
  modifier: CardModifier;
};
export type AlternateCard = {
  cardType: "alternate";
  value: number;
  alternate: number;
};
export type SocketFunction =
  | "reverse"
  | "rotate"
  | "clone"
  | "split"
  | "square"
  | "triangle"
  | "prime"
  | "parts"
  | "round";
export type SocketCard = {
  cardType: "socket";
  socketFunction: SocketFunction;
};
export type PlugCard = NumberCard | AlternateCard;

export type Card = PlugCard | SocketCard;
