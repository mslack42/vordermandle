import { Nonsense } from "../game-generation";

export const Tier1Bucket: Nonsense[] = [
  "doublerPlug",
  "bigNumber",
  "alternate",
  "incrementOne",
  "rotateSocket",
  "decrementOne",
  "reverseSocket",
];

export const Tier2Bucket: Nonsense[] = [
  ...Tier1Bucket,
  "reversePlug2",
  "rotatePlug",
  "reversePlug",
  "incrementMany",
  "roundSocket",
  "squareSocket",
  "splitSocket",
  "cloneSocket",
];

export const Tier3Bucket: Nonsense[] = [
  ...Tier2Bucket,
  "targetIncrementOne",
  "targetIncrementMany",
  "targetDecrementOne",
  "targetDecrementMany",
  "targetReverse",
  "primeSocket",
  "rotatePlug2",
  "triangleSocket",
  "partsSocket",
];
