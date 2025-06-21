import { TargetModifier } from "@/game/common/TargetModifier";
import { faBackward, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
type TargetDisplayProps = {
  value: number;
  modifier?: TargetModifier;
};
export const TargetDisplay = (props: TargetDisplayProps) => (
  <div className="relative w-60 h-18 bg-slate-400 border-6 border-foreground">
    <div className="bg-black w-full h-full">
      <div className="h-full w-full flex flex-col justify-center">
        <div className="flex flex-row justify-center">
          <p className="text-6xl text-red-600">{props.value}</p>
        </div>
      </div>
    </div>
    {props.modifier && (
      <div className="absolute right-[-16] top-[-16]">
        <Modifier modifier={props.modifier} />
      </div>
    )}
  </div>
);

function Modifier({ modifier }: { modifier: TargetModifier }) {
  const contentFn = (mod: TargetModifier) => {
    switch (mod.modifierType) {
      case "reverse":
        return (
          <>
            <FontAwesomeIcon icon={faBackward} />
          </>
        );
      case "rotate":
        return (
          <>
            <FontAwesomeIcon icon={faRotateLeft} />
          </>
        );
      case "increment":
        return (
          <>
            {[mod.incrementBy > 0 ? "+" : "", String(mod.incrementBy)].join("")}
          </>
        );
    }
    return <></>;
  };

  return (
    <div className="h-12 w-12 rounded-4xl bg-theme-green flex flex-row justify-center text-xl border-4 border-foreground">
      <div className="flex flex-col justify-center">
        <p>{contentFn(modifier)}</p>
      </div>
    </div>
  );
}
