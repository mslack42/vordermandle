"use client";
import { Card, NumberCard, AlternateCard, SocketCard } from "@/game-generation/common/Card";
import { CardSVG } from "./CardSVG";

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
    <div className="w-14 h-18 bg-slate-400 justify-center flex flex-col">
      <p>{card.socketFunction}</p>
      <div className="w-full flex flex-row justify-center"><div className="bg-black w-8 h-10"></div></div>
      
    </div>
  );
}
