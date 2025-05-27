import { useContext } from "react";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";

export function TargetBox() {
  const { target } = useContext(PlayingInterfaceContext);
  return <div className="w-full flex flex-row justify-center bg-white">
    <div className="h-24 w-30 bg-black text-red-500 flex flex-col">
      <p className="text-xl">{target.value}</p>
      {target.modifier && <p>{JSON.stringify(target.modifier)}</p>}</div>
  </div>;
}
