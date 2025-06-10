import Link from "next/link";

export default async function ListOfDailyGames() {
  const now = new Date(Date.now());
  const dates: Date[] = [];
  let iDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(),0,0,0,0);
  while (iDate < now && dates.length < 100) {
    dates.push(iDate);
    iDate = new Date(
      iDate.getFullYear(),
      iDate.getMonth(),
      iDate.getDate() - 1,
      12,0,0,0
    );
  }

  function dateIsActive(d: Date): boolean {
    const diff = now.getTime() - d.getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    return days < 10;
  }

  return (
    <div className="w-full flex flex-col h-full pb-2">
      <div className="flex-none w-full min-w-full flex flex-row justify-between p-2 pb-4">
        <div className="flex-1/6">
          <Link href={"/"}>
            <button className="p-2 bg-theme-red text-sm rounded-xl border-foreground border-4 hover:bg-theme-red-darker cursor-pointer">
              Back
            </button>
          </Link>
        </div>
        <h1 className="text-2xl p-2 px-8 bg-theme-blue border-foreground border-4">
          Daily Puzzles
        </h1>
        <span className="flex-1/6"></span>
      </div>

      <ul
        className="grow h-full flex flex-col w-full gap-2 overflow-y-auto 
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
       [&::-webkit-scrollbar-track]:bg-gray-100
       [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 "
      >
        {dates.map((d) => (
          <li key={d.toString()} className="flex flex-row justify-center">
            <DailyPuzzleButton date={d} isActive={dateIsActive(d)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function puzzleUrl(d: Date) {
  return `/daily/${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
}

type DailyPuzzleButtonProps = {
  date: Date;
  isActive?: boolean;
};
function DailyPuzzleButton(props: DailyPuzzleButtonProps) {
  const bg = props.isActive
    ? " bg-theme-green hover:bg-theme-green-darker"
    : " bg-theme-red hover:bg-theme-red-darker";
  return (
    <Link href={puzzleUrl(props.date)}>
      <button
        className={"w-80 p-2 rounded-xl border-foreground border-4 cursor-pointer " + bg}
      >
        <div className="w-full flex flex-row justify-between">
          <p>{props.date.toUTCString()}</p>
          <div>1</div>
        </div>
      </button>
    </Link>
  );
}
