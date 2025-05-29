import { CountdownGame } from "@/game-generation/common/CountdownGame";
import { CardPlayArea } from "./CardPlayArea";
import { PlayingInterfaceContextProvider } from "./PlayingInterfaceContext";
import { TargetBox } from "./TargetBox";
import { GameHistory } from "./GameHistory";

type Props = {
  game: CountdownGame;
};
export function SwishInterface(props: Props) {
  const { game } = props;

  return (
    <>
      <PlayingInterfaceContextProvider game={game}>
        <TargetBox />
        <GameHistory />
        <CardPlayArea />
      </PlayingInterfaceContextProvider>
    </>
  );
}
