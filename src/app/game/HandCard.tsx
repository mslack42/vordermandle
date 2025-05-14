"use client";
import { Card, NumberCard, AlternateCard, SocketCard } from "@/game-generation/common/Card";
import { CardSVG, SocketSVG } from "./CardSVG";

type HandCardProps = {
  card: Card;
};
export function HandCard(props: HandCardProps) {
  const { card } = props;
  return (
    <>
      {card.cardType == "number" ? <HandNumberCard card={card} /> : <></>}
      {card.cardType == "alternate" ? <HandAlternateCard card={card} /> : <></>}
      {card.cardType == "socket" ? <HandSocketCard card={card} /> : <></>}
    </>
  );
}
type HandNumberCardProps = {
  card: NumberCard;
};
function HandNumberCard(props: HandNumberCardProps) {
  const { card } = props;
  return (
    <CardSVG value={card.value} size={80} modifier={card.modifier}/>
  );
}
type HandAlternateCardProps = {
  card: AlternateCard;
};
function HandAlternateCard(props: HandAlternateCardProps) {
  const { card } = props;
  return (
    <CardSVG value={card.value} size={80} alternate={card.alternate}/>
  );
}
type HandSocketCardProps = {
  card: SocketCard;
};
function HandSocketCard(props: HandSocketCardProps) {
  const { card } = props;
  return (
    <SocketSVG size={120} socketFn={card.socketFunction}/>
  );
}
