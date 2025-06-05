import Link from "next/link";

const beginningOfTime = new Date(2025, 4, 1);

export default async function MonthOfGames() {
  const now = new Date(Date.now());
  const dates: Date[] = [];
  let iDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (iDate < now && iDate >= beginningOfTime && dates.length < 100) {
    dates.push(iDate);
    iDate = new Date(
      iDate.getFullYear(),
      iDate.getMonth(),
      iDate.getDate() - 1
    );
  }

  function puzzleUrl(d: Date) {
    return `/daily/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  }

  return (
    <div>
      <h1>Daily Puzzles</h1>
      <ul>
        {dates.map((d) => (
          <li key={d.toLocaleString()}>
            <Link href={puzzleUrl(d)}>{d.toLocaleString()}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
