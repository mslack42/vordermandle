import { SwishInterface } from "@/components/SwishInterface";
import { CountdownGame } from "@/game-generation/common/CountdownGame";
import { getGameByDate } from "@/sheetsDB/getGamesList";
import { redirect } from "next/navigation";

type RouteParams = {
  year: number;
  month: number;
  day: number;
};

export const revalidate = 60;

export default async function DailyGameAtIndex({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { year, month, day} = await params;
  let game: CountdownGame;
  try {
    game = await getGameByDate(year, month, day);
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
