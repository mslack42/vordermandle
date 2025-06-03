import { SwishInterface } from "@/components/SwishInterface";
import { CountdownGame } from "@/game-generation/common/CountdownGame";
import { getGameByDate } from "@/sheetsDB/getGamesList";
import { redirect } from "next/navigation";

type RouteParams = {
  year: number;
  month: number;
  day: number;
  puzzleIndex: number;
};

export default async function DailyGameAtIndex({
  params,
}: {
  params: RouteParams;
}) {
  const { year, month, day, puzzleIndex } = await params;
  let game: CountdownGame;
  try {
    game = await getGameByDate(year, month, day, puzzleIndex);
  } catch (e) {
    console.dir(e)
    redirect("/");
  }

  return (
    <div>
      <SwishInterface game={game} />
    </div>
  );
}
