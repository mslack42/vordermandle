export type IncrementCardModifier = {
  modifierType: "increment";
  incrementBy: number;
};
export type DoubleCardModifier = {
  modifierType: "double";
};
export type ReverseCardModifier = {
  modifierType: "reverse";
  strength: number;
};
export type RotateCardModifier = {
  modifierType: "rotate";
  strength: number;
};
export type NoneCardModifier = {
  modifierType: "none";
};

export type CardModifier =
  | NoneCardModifier
  | IncrementCardModifier
  | ReverseCardModifier
  | RotateCardModifier
  | DoubleCardModifier;
