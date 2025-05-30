import { useContext } from "react";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";
import { TargetSVG } from "./TargetSVG";

export function TargetBox() {
  const { target } = useContext(PlayingInterfaceContext);
  return (
    <div className="w-full flex flex-row justify-center bg-white">
      <TargetSVG value={target.value} modifier={target.modifier} size={100} />
    </div>
  );
}
