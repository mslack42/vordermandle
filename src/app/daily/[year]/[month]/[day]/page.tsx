import { SwishInterface } from "@/components/SwishInterface";
import { CountdownGame } from "@/game/common/CountdownGame";
import { getGameByDate } from "@/sheetsDB/getGamesList";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { FeedbackLink } from "./FeedbackLink";

type RouteParams = {
  year: number;
  month: number;
  day: number;
};

const getGame = unstable_cache(
  async (year: number, month: number, day: number) => {
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

  const now = new Date(Date.now());
  const gameDate = new Date(year, month - 1, day);
  const daysDiff = (now.getTime() - gameDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysDiff > 100) {
    redirect("/");
  }

  let game: CountdownGame;
  try {
    game = await getGame(year, month, day);
  } catch {
    redirect("/");
  }

  return (
    <div>
      <ButtonBar gameDate={gameDate} />
      <SwishInterface game={game} />
      <FeedbackLink domain={`Puzzle ${year}/${month}/${day}`} />
    </div>
  );
}

type ButtonBarProps = {
  gameDate: Date;
};
function ButtonBar(props: ButtonBarProps) {
  const now = new Date(Date.now());
  const oldestGame = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 100
  );
  const disablePrev = props.gameDate <= oldestGame;
  const disableNext = props.gameDate >= now;
  return (
    <div className="w-full flex flex-row justify-between text-center text-sm">
      <div className="flex-1/3 px-4 flex flex-row justify-evenly">
        {!disablePrev && (
          <div className="flex flex-col justify-center">
            <a className="bg-theme-red border-4 rounded-xl border-foreground p-1">
              Prev
            </a>
          </div>
        )}
        {!disableNext && (
          <div className="flex flex-col justify-center">
            <a className="bg-theme-red border-4 rounded-xl border-foreground p-1">
              Next
            </a>
          </div>
        )}
      </div>
      <div className="flex-1/3 flex flex-row justify-center">
        <a className="bg-theme-blue border-4 border-foreground p-1 text-lg">
          Vordermandle
        </a>
      </div>
      <div className="flex-1/3  flex flex-row justify-center">
        <div className="flex flex-col justify-center">
          <a className="bg-theme-purple border-4 rounded-xl border-foreground p-1">
            Feedback
          </a>
        </div>
      </div>
    </div>
  );
}
