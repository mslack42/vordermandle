"use client";
import { Card, NumberCard, AlternateCard, SocketCard } from "@/game/common/Card";
import { CardDisplay, SocketCardDisplay } from "./CardDisplay";

type HandCardProps = {
  card: Card;
};
export function HandCard(props: HandCardProps & React.PropsWithChildren) {
  const { card } = props;
  return (
    <>
      {card.cardType == "number" ? <HandNumberCard card={card} /> : <></>}
      {card.cardType == "alternate" ? <HandAlternateCard card={card} /> : <></>}
      {card.cardType == "socket" ? <HandSocketCard card={card} >{props.children}</HandSocketCard> : <></>}
    </>
  );
}
type HandNumberCardProps = {
  card: NumberCard;
};
function HandNumberCard(props: HandNumberCardProps) {
  const { card } = props;
  return (
    <CardDisplay value={card.value} modifier={card.modifier}/>
  );
}
type HandAlternateCardProps = {
  card: AlternateCard;
};
function HandAlternateCard(props: HandAlternateCardProps) {
  const { card } = props;
  return (
    <CardDisplay value={card.value} alternate={card.alternate}/>
  );
}
type HandSocketCardProps = {
  card: SocketCard;
};
function HandSocketCard(props: HandSocketCardProps & React.PropsWithChildren) {
  const { card } = props;
  return (
    <SocketCardDisplay socketFn={card.socketFunction}>{props.children}</SocketCardDisplay>
  );
}
