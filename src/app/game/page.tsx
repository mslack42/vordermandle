"use client"
import { GameProfile, generateGame, Nonsense } from "@/game-generation/game-generation";

const nonsense: Nonsense[] = [
    //// Below sockets nonsense only seems to run reasonably when they replace 2 numbers (since they spawn numbers, I presume)
    "splitSocket" ,
    "cloneSocket" ,
    "partsSocket" ,
    //// Below socket nonsense seems to run reasonably so long as they replace a number
    "reverseSocket" ,
    "triangleSocket" ,
    "squareSocket" ,
    "rotateSocket" ,
    "primeSocket" ,
    "roundSocket" ,
    //// Below nonsense doesn't seem to slow things down too much
    "incrementOne" ,
    "decrementOne" ,
    "incrementMany" ,
    "reversePlug" ,
    "rotatePlug" ,
    "alternate" ,
    "bigNumber" ,
    "reversePlug2" ,
    "rotatePlug2" ,
    "doublerPlug" ,
    "targetIncrementOne" ,
    "targetIncrementMany" ,
    "targetDecrementOne" ,
    "targetDecrementMany" ,
    "targetReverse"
]

export default function Game() {
  const profile: GameProfile = {
    bigsCount: 2,
    nonsenseCounts: 3,
    useExpertBigs: false,
    legalNonsense: nonsense,
  };
  const game = generateGame(profile);
  return (
    <div>
      <h1>Game page</h1>
      <p>{JSON.stringify(game)}</p>
    </div>
  );
}
