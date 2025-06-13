import { useContext } from "react";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { TargetDisplay } from "./TargetDisplay";

export function TargetBox() {
  const { target } = useContext(PlayingInterfaceContext);
  return (
    <div className="w-full flex flex-row justify-center select-none">
      <TargetDisplay value={target.value} modifier={target.modifier} />
    </div>
  );
}
