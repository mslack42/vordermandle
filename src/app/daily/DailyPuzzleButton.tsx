"use client";
import { useLocalStoreSelector } from "@/localstore/hooks";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type DailyPuzzleButtonProps = {
  date: Date;
  isActive?: boolean;
};
export function DailyPuzzleButton(props: DailyPuzzleButtonProps) {
  const dailyData = useLocalStoreSelector((p) => p.playerData.dailyPuzzleData);
  function getGameId(diff: number) {
    return `${props.date.getUTCFullYear()}/${props.date.getUTCMonth()}/${props.date.getUTCDate()}/${diff}`;
  }
  const gameDataArr = [
    dailyData[getGameId(1)],
    dailyData[getGameId(2)],
    dailyData[getGameId(3)],
  ];
  const stars = [
    gameDataArr[0] == null || !gameDataArr[0].solved
      ? 0
      : Math.max(0, 3 - gameDataArr[0].cluesGiven),
    gameDataArr[1] == null || !gameDataArr[1].solved
      ? 0
      : Math.max(0, 3 - gameDataArr[1].cluesGiven),
    gameDataArr[2] == null || !gameDataArr[2].solved
      ? 0
      : Math.max(0, 4 - gameDataArr[2].cluesGiven),
  ].reduce((a, b) => a + b);

  const dateHasPotential = gameDataArr.some((g) => g == null || !g.solved);

  const bg = props.isActive
    ? " bg-theme-green hover:bg-theme-green-darker"
    : " bg-theme-red hover:bg-theme-red-darker";
  return (
    <Link href={puzzleUrl(props.date)}>
      <button
        className={
          "w-80 p-2 rounded-xl border-foreground border-4 cursor-pointer " + bg
        }
      >
        <div className="w-full flex flex-row justify-between">
          <p>
            {props.date.toLocaleDateString("en-gb", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            {dateHasPotential ? "*" : ""}
          </p>
          <div className="flex flex-row items-center gap-1">
            {stars > 0 && (
              <>
                <p>{stars}</p>
                <FontAwesomeIcon icon={faStar} className="text-theme-yellow" />
              </>
            )}
          </div>
        </div>
      </button>
    </Link>
  );
}

function puzzleUrl(d: Date) {
  return `/daily/${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
}
