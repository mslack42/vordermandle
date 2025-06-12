import { DailySwishInterfaceProvider } from "@/app/daily/[year]/[month]/[day]/DailySwishInterfaceProvider";
import { SwishInterface } from "@/components/SwishInterface";
import { CountdownGame } from "@/game/common/CountdownGame";
import { GameSet } from "@/sheetsDB/getGamesList";
import Link from "next/link";

export function DailyGame({
  gameSet,
  gameDate,
}: {
  gameDate: Date;
  gameSet: GameSet;
}) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full flex-none h-min">
        <ButtonBar gameDate={gameDate} />
      </div>
      <div className="w-full h-full grow">
        <DailySwishInterfaceProvider gameSet={gameSet} gameDate={gameDate}>
          <SwishInterface/>
        </DailySwishInterfaceProvider>
      </div>
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
  
  const year = props.gameDate.getFullYear();
  const month = props.gameDate.getMonth() + 1;
  const date = props.gameDate.getDate();
  
  const nextDate = new Date(year, month - 1, date + 1);
  const prevDate = new Date(year, month - 1, date - 1);
  const disablePrev = prevDate < oldestGame;
  const disableNext = nextDate >= now;

  return (
    <div className="w-full flex flex-row justify-between text-center text-sm select-none py-1">
      <div className="flex-1/3 px-4 flex flex-row justify-evenly">
        {!disablePrev && (
          <div className="flex flex-col justify-center ">
            <Link
              href={`/daily/${prevDate.getFullYear()}/${
                prevDate.getMonth() + 1
              }/${prevDate.getDate()}`}
              className="bg-theme-red border-4 rounded-xl border-foreground p-1 cursor-pointer"
            >
              Prev
            </Link>
          </div>
        )}
        {!disableNext && (
          <div className="flex flex-col justify-center ">
            <Link
              href={`/daily/${nextDate.getFullYear()}/${
                nextDate.getMonth() + 1
              }/${nextDate.getDate()}`}
              className="bg-theme-red border-4 rounded-xl border-foreground p-1 cursor-pointer"
            >
              Next
            </Link>
          </div>
        )}
      </div>
      <div className="flex-1/3 flex flex-row justify-center ">
        <Link
          href={"/"}
          className="bg-theme-blue border-4 border-foreground p-1 text-lg cursor-pointer"
        >
          Vordermandle
        </Link>
      </div>
      <div className="flex-1/3  flex flex-row justify-center ">
        <div className="flex flex-col justify-center">
          <a
            className="bg-theme-purple border-4 rounded-xl border-foreground p-1 cursor-pointer"
            href={FeedbackLink(`Puzzle ${year}/${month}/${date}`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Feedback
          </a>
        </div>
      </div>
    </div>
  );
}

function FeedbackLink(domain: string) {
  return process.env.FEEDBACK_URL_ROOT + domain;
}
