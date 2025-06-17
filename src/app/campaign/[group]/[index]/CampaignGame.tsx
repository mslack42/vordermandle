import { SwishInterface } from "@/components/SwishInterface";
import { CountdownGame } from "@/game/common/CountdownGame";
import Link from "next/link";
import { CampaignSwishInterfaceProvider } from "./CampaignSwishInterfaceProvider";

export function CampaignGame({
  game,
  gameId,
}: {
  game: CountdownGame;
  gameId: string;
}) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full flex-none h-min">
        <ButtonBar gameId={gameId} />
      </div>
      <div className="w-full h-full grow">
        <CampaignSwishInterfaceProvider game={game} gameId={gameId}>
          <SwishInterface />
        </CampaignSwishInterfaceProvider>
      </div>
    </div>
  );
}

function ButtonBar(props: { gameId: string }) {
  return (
    <div className="w-full flex flex-row justify-between text-center text-xs md:text-sm select-none py-1">
      <div className="flex-1/3 px-4 flex flex-row justify-evenly">
        <div className="flex flex-col justify-center ">
          <Link
            href="/campaign"
            className="bg-theme-red border-4 rounded-xl border-foreground p-1 cursor-pointer"
          >
            Back
          </Link>
        </div>
      </div>
      <div className="flex-1/3 flex flex-row justify-center ">
        <Link
          href={"/"}
          className="bg-theme-blue border-4 border-foreground p-1 text-sm md:text-lg cursor-pointer"
        >
          Vordermandle
        </Link>
      </div>
      <div className="flex-1/3  flex flex-row justify-center gap-2">
        <div className="flex flex-col justify-center">
          <a
            className="bg-theme-purple border-4 rounded-xl border-foreground p-1 cursor-pointer"
            href={FeedbackLink(`Puzzle ${props.gameId}`)}
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
