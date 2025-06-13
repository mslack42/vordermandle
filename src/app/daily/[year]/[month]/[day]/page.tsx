import { GameSet, getGameSetByDate } from "@/sheetsDB/getGamesList";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { DailyGame } from "./DailyGame";

type RouteParams = {
  year: number;
  month: number;
  day: number;
};

const getGameSet = unstable_cache(
  async (year: number, month: number, day: number) => {
    return getGameSetByDate(year, month, day);
  },
  [],
  {
    revalidate: 300,
  },
);

export default async function DailyGameAtIndex({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { year, month, day } = await params;

  const now = new Date(Date.now());
  const gameDate = new Date(year, month - 1, day);
  const daysDiff = (now.getTime() - gameDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysDiff > 100 || daysDiff < 0) {
    redirect("/");
  }

  let gameSet: GameSet;
  try {
    gameSet = await getGameSet(year, month, day);
  } catch {
    redirect("/");
  }

  return <DailyGame gameSet={gameSet} gameDate={gameDate} />;
}
