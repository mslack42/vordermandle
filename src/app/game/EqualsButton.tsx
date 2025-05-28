import { useContext, useEffect, useState } from "react";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { EvaluationResult } from "@/game-generation/evaluate/EvaluationResult";
import { EvaluateStep } from "@/game-generation/evaluate/evaluateStep";
import { PlugCard } from "@/game-generation/common/Card";
import { SolutionStep } from "@/game-generation/evaluate/SolutionStep";
import { v4 as uuidv4 } from "uuid";
import { evolveCard, evolveTarget } from "@/game-generation/evaluate/evolve";
import { CardWithId } from "./CardWithId";
import { HandCard } from "./HandCard";
export function EqualsButton() {
  const {
    target,
    setTarget,
    setPlay,
    play,
    setHand,
    hand,
    sockettedCards,
    setSockettedCards,
    operatorChoice,
  } = useContext(PlayingInterfaceContext);
  const [pendingResult, setPendingResult] = useState<EvaluationResult | null>(
    null
  );
  useEffect(() => {
    if (play.length == 1 && play[0].card.cardType == "socket") {
      const sockettedCard = sockettedCards["socket" + play[0].id];
      if (sockettedCard && sockettedCard.card.cardType != "socket") {
        const currStep: SolutionStep = {
          stepType: "insertion",
          outer: play[0].card,
          inner: sockettedCard.card,
        };
        const res = EvaluateStep(currStep);
        setPendingResult(res);
        return;
      }
    }
    if (
      play.length == 2 &&
      play.every((c) => c.card.cardType != "socket") &&
      operatorChoice
    ) {
      const currStep: SolutionStep = {
        stepType: "binary",
        left: play[0].card as PlugCard,
        right: play[1].card as PlugCard,
        operation: operatorChoice,
      };
      const res = EvaluateStep(currStep);
      setPendingResult(res);
      return;
    }
  }, [operatorChoice, play, sockettedCards]);
  const disabled = !pendingResult || !pendingResult.success;

  const handleSubmit = () => {
    if (!pendingResult?.success) {
      return;
    }
    setPlay([]);
    const newHand: CardWithId[] = [
      ...hand,
      ...pendingResult.cards.map((c) => {
        return {
          card: c,
          id: uuidv4(),
        };
      }),
    ].map((c) => {
      return {
        card: evolveCard(c.card),
        id: c.id,
      };
    });
    setHand(newHand);
    const newSockettedCards: { [key: string]: CardWithId } = {};
    Object.keys(sockettedCards).forEach((k) => {
      newSockettedCards[k] = {
        ...sockettedCards[k],
        card: evolveCard(sockettedCards[k].card),
      };
    });
    setSockettedCards(newSockettedCards);
    setTarget(evolveTarget(target));
  };

  return (
    <>
    <div
      className={
        "h-24 w-24 text-lg rounded-xl " +
        (disabled ? "bg-gray-200 text-black" : "bg-green-400")
      }
    >
      <button
        className="h-full w-full "
        disabled={disabled}
        onClick={handleSubmit}
      >
        {pendingResult?.success == false ? pendingResult.errorReason : "="}
      </button>
    </div>
      {pendingResult?.success ? (
        pendingResult.cards.map((c, i) => {
          return (
            <div key={"pending" + i} className="opacity-50">
              <HandCard card={c}></HandCard>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
}
