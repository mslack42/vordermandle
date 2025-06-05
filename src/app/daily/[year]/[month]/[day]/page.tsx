import { SwishInterface } from "@/components/SwishInterface";
import { CountdownGame } from "@/game/common/CountdownGame";
import { getGameByDate } from "@/sheetsDB/getGamesList";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FeedbackLink } from "./FeedbackLink";

type RouteParams = {
  year: number;
  month: number;
  day: number;
};

const getGame = unstable_cache(
  async (year, month: number, day: number) => {
    return getGameByDate(year, month, day);
  },
  [],
  {
    revalidate: 300,
  }
);

export default async function DailyGameAtIndex({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { year, month, day } = await params;

  let game: CountdownGame;
  try {
    game = await getGame(year, month, day);
  } catch (e) {
    console.dir(e);
    redirect("/");
  }

  return (
    <div>
      <SwishInterface game={game} />
      <FeedbackLink domain={`Puzzle ${year}/${month}/${day}`}/>
    </div>
  );
}

