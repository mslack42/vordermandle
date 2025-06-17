"use client";
import { campaignDefinition, CampaignSet } from "@/game/campaign/campaign";
import { useLocalStoreSelector } from "@/localstore/hooks";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function ListOfCampaignGames() {
  const campaignPuzzleData = useLocalStoreSelector(
    (p) => p.playerData.campaignPuzzleData,
  );
  const stars = Object.values(campaignPuzzleData).filter(
    (g) => g.solved,
  ).length;

  return (
    <div className="w-full flex flex-col h-full pb-2 select-none">
      <div className="flex-none w-full min-w-full flex flex-row justify-between p-2 pb-4">
        <div className="flex-1/6">
          <Link href={"/"}>
            <button className="p-2 bg-theme-red text-sm rounded-xl border-foreground border-4 hover:bg-theme-red-darker cursor-pointer">
              Back
            </button>
          </Link>
        </div>
        <h1 className="text-2xl p-2 px-8 bg-theme-blue border-foreground border-4">
          Campaign
        </h1>
        <span className="flex-1/6"></span>
      </div>
      <div className="w-full text-xl flex flex-row justify-center gap-2 items-center">
        <p>{stars}</p>
        <FontAwesomeIcon icon={faStar} className="text-theme-yellow" />
      </div>

      <ul
        className="grow h-full flex flex-col w-full gap-2 overflow-y-auto px-8
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
       [&::-webkit-scrollbar-track]:bg-gray-100
       [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 "
      >
        {campaignDefinition.sets.map((s) => (
          <CampaignGameSet set={s} key={s.id} />
        ))}
      </ul>
    </div>
  );
}

function CampaignGameSet(props: { set: CampaignSet }) {
  const campaignPuzzleData = useLocalStoreSelector(
    (p) => p.playerData.campaignPuzzleData,
  );
  const currentScore = Object.values(campaignPuzzleData).filter(
    (g) => g.solved,
  ).length;
  if (props.set.unlocksAt <= currentScore) {
    return (
      <div className="w-full p-2">
        <h2 className="text-2xl">{props.set.name}</h2>
        <div className="flex flex-row flex-wrap gap-2 p-2">
          {props.set.games.map((g) => (
            <CampaignGame key={g.id} gameId={g.id} setId={props.set.id} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full relative p-2">
        <div className="w-full opacity-50 blur-sm">
          <h2 className="text-2xl">{props.set.name}</h2>
          <div className="flex flex-row flex-wrap gap-2 p-2">
            {props.set.games.map((g) => (
              <CampaignGame key={g.id} gameId={g.id} setId={props.set.id} />
            ))}
          </div>
        </div>
        <div className="absolute top-0 bottom-0 left-0 right-0">
          <div className="w-full h-full flex flex-col justify-center">
            <div className="w-full flex flex-row justify-center">
              <p>
                Unlocks at {props.set.unlocksAt}{" "}
                <FontAwesomeIcon icon={faStar} className="text-theme-yellow" />
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function CampaignGame(props: {
  gameId: string;
  setId: string;
  disabled?: boolean;
}) {
  const puzzleId = `${props.setId}/${props.gameId}`;
  const puzzleData = useLocalStoreSelector(
    (p) => p.playerData.campaignPuzzleData[puzzleId],
  );
  const solved = puzzleData?.solved;
  if (!props.disabled) {
    return (
      <Link
        className={
          "w-10 md:w-18 h-10 md:h-18 flex flex-col justify-center font-bold rounded-sm border-2 border-foreground" +
          (solved ? " bg-theme-green hover:bg-theme-green-darker" : " bg-theme-red hover:bg-theme-red-darker")
        }
        href={`/campaign/${puzzleId}`}
      >
        <div className="flex flex-row justify-center">
          <p>{props.gameId}</p>
        </div>
      </Link>
    );
  } else {
    return (
      <button
        className={
          "w-10 md:w-18 h-10 md:h-18 flex flex-col justify-center font-bold rounded-sm border-2 border-foreground" +
          (solved ? " bg-theme-green" : " bg-theme-red")
        }
        disabled={props.disabled}
      >
        <div className="flex flex-row justify-center">
          <p>{props.gameId}</p>
        </div>
      </button>
    );
  }
}
