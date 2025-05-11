type IncrementTargetModifier = {
    modifierType: "increment";
    incrementBy: number;
};
type ReverseTargetModifier = {
    modifierType: "reverse";
};
type RotateTargetModifier = {
    modifierType: "rotate";
};
type NoneTargetModifier = {
    modifierType: "none";
};

export type TargetModifier = NoneTargetModifier | IncrementTargetModifier | ReverseTargetModifier | RotateTargetModifier;
