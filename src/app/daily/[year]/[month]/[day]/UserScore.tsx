"use client";
import { useLocalStoreSelector } from "@/localstore/hooks";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

type UserScoreProps = {
  today: Date;
};
export function UserScore(props: UserScoreProps) {
  const dailyData = useLocalStoreSelector((p) => p.playerData.dailyPuzzleData);
  const [score, setScore] = useState(evaluateScore(dailyData, props.today));
  useEffect(() => {
    setScore(evaluateScore(dailyData, props.today));
  }, [dailyData, props.today]);
  return (
    <div className="flex flex-row">
      <p className="text-foreground text-xl">{score}</p>
      <div className="flex flex-col justify-center">
        <FontAwesomeIcon icon={faStar} className="text-theme-yellow text-xl" />
      </div>
    </div>
  );
}
function evaluateScore(
  dailyData: { [key: string]: { solved: boolean; cluesGiven: number } },
  today: Date,
) {
  const dates = [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
    .map((d) => {
      const dt = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + d,
      );
      return dt;
    })
    .map((dt) => `${dt.getFullYear()}/${dt.getMonth()}/${dt.getDate()}`);
  const score = sum(
    ...[1, 2, 3].map((diff) => {
      const diffScore = sum(
        ...dates.map((d) => {
          const key = `${d}/${diff}`;
          const gameData = dailyData[key];
          if (!gameData || !gameData.solved) {
            return 0;
          }
          if (diff == 1) {
            return Math.max(0, 2 - gameData.cluesGiven);
          } else if (diff == 2) {
            return Math.max(0, 3 - 2 * gameData.cluesGiven);
          } else if (diff == 3) {
            return Math.max(0, 5 - 2 * gameData.cluesGiven);
          }
          return 0;
        }),
      );
      return diffScore;
    }),
  );

  return score;
}

function sum(...numbers: number[]): number {
  if (numbers.length == 0) {
    return 0;
  }
  if (numbers.length == 1) {
    return numbers[0];
  }
  return numbers[0] + sum(...numbers.splice(1));
}
