import { CountdownGame } from "@/game-generation/common/CountdownGame";
import { CardPlayArea } from "./CardPlayArea";
import { PlayingInterfaceContext, PlayingInterfaceContextProvider } from "./PlayingInterfaceContext";
import { TargetBox } from "./TargetBox";
import { useContext } from "react";

type Props = {
  game: CountdownGame;
};
export function SwishInterface(props: Props) {
  const { game } = props;

  return (
    <>
      <PlayingInterfaceContextProvider game={game}>
        <TargetBox/>
        <CardPlayArea />
        <ResetGameButton/>
      </PlayingInterfaceContextProvider>
    </>
  );
}

function ResetGameButton() {
  const {resetGame} = useContext(PlayingInterfaceContext)
  return <button onClick={resetGame}>Reset Game</button>
}