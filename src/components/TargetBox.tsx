import { useContext } from "react";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { TargetDisplay } from "./TargetDisplay";
import { InfoButton } from "./InfoButton";

export function TargetBox() {
  const { target } = useContext(PlayingInterfaceContext);
  return (
    <div className="w-full flex flex-row justify-between select-none">
      <span className="w-1/3"></span>
      <TargetDisplay value={target.value} modifier={target.modifier} />
      <span className="w-1/3">
        <div className="w-full h-full flex flex-row justify-center">
          <div className="h-full flex flex-col justify-center">
            <InfoButton />
          </div>
        </div>
      </span>
    </div>
  );
}
