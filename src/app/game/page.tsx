"use client";
import {
  GameProfile,
  generateGame,
  Nonsense,
} from "@/game-generation/game-generation";
import { CountdownGame } from "@/game-generation/common/CountdownGame";
import { useEffect, useState } from "react";
// import { GamePlay } from "./GamePlay";
// import { PlayArea } from "./PlayArea";
import { SwishInterface } from "./SwishInterface";

const nonsense: Nonsense[] = [
  // "JUST_AN_EXTRA_NUMBER" - new modifier idea
  //// Below sockets nonsense only seems to run reasonably when they replace 2 numbers (since they spawn numbers, I presume)
  "splitSocket",
  "cloneSocket",
  "partsSocket",
  //// Below socket nonsense seems to run reasonably so long as they replace a number
  "reverseSocket",
  "triangleSocket",
  "squareSocket",
  "rotateSocket",
  "primeSocket",
  "roundSocket",
  //// Below nonsense doesn't seem to slow things down too much
  "incrementOne",
  "decrementOne",
  "incrementMany",
  "reversePlug",
  "rotatePlug",
  "alternate",
  "bigNumber",
  "reversePlug2",
  "rotatePlug2",
  "doublerPlug",
  "targetIncrementOne",
  "targetIncrementMany",
  "targetDecrementOne",
  "targetDecrementMany",
  "targetReverse",
];

export default function Game() {
  const [game, setGame] = useState<CountdownGame | null>(null);
  useEffect(() => {
    const profile: GameProfile = {
      bigsCount: 2,
      nonsenseCounts: 3,
      useExpertBigs: false,
      legalNonsense: nonsense,
    };
    setGame(generateGame(profile));
  }, []);
  return (
    <div>
      {/* {game == null ? <p>Loading game...</p> : <GamePlay game={game} />}
      {game == null ? <p>Loading game...</p> : <PlayArea game={game} />} */}
      {game == null ? <p>Loading game</p> : <SwishInterface game={game} />}
    </div>
  );
}
