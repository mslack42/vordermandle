import Link from "next/link";
import { redirect } from "next/navigation";

type RouteParams = {
  year: number;
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

const beginningOfTime = new Date(2025, 4, 1);

export default async function MonthOfGames({
  params,
}: {
  params: RouteParams;
}) {
  const { year, month } = await params;

  const thisPageMonth = new Date(year, month - 1, 1);
  if (thisPageMonth < beginningOfTime) {
    redirect("/");
  }
  const now = new Date();
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  if (thisPageMonth >= startOfNextMonth) {
    redirect("/");
  }

  const dates: Date[] = [];
  let iDate = new Date(year, month - 1, 1);
  while (iDate < now && iDate < startOfNextMonth) {
    dates.push(iDate);
    iDate = new Date(
      iDate.getFullYear(),
      iDate.getMonth(),
      iDate.getDate() + 1
    );
  }

  return (
    <div>
      <h1>{thisPageMonth.toLocaleString("default", { month: "long" })}</h1>
      <ul>
        {dates.map((d) => (
          <li key={d.toLocaleString()}>
            <Link href={"/daily/" + year + "/" + month.toString() + "/" + d.getDate()}>
              {d.toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
