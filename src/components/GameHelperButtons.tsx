"use client";
import { useContext } from "react";
import { PlayingInterfaceContext } from "./PlayingInterfaceContext";

export function GameHelperButtons() {
  const { onClueRequested, offerClues, cluesGiven, gameHistory, complete } =
    useContext(PlayingInterfaceContext);
  const showCluesButton =
    !complete && offerClues && cluesGiven == gameHistory.length;
  return (
    <>
      {showCluesButton && (
        <div className="w-full grow">
          <div className="flex-none flex flex-row w-full justify-center gap-2">
            <button
              onClick={onClueRequested}
              className="p-1 rounded-xl bg-theme-green hover:bg-theme-green-darker border-2 border-foreground"
            >
              Get a clue
            </button>
          </div>
        </div>
      )}
    </>
  );
}
