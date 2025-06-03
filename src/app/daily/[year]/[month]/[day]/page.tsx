import Link from "next/link";
import { redirect } from "next/navigation";

type RouteParams = {
  year: number;
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  day: number;
};

const beginningOfTime = new Date(2025, 4, 1);

export default async function DailyGames({ params }: { params: Promise<RouteParams> }) {
  const { year, month, day } = await params;

  const thisPageDay = new Date(year, month - 1, day);
  if (thisPageDay < beginningOfTime) {
    redirect("/");
  }
  const now = new Date();
  if (thisPageDay > now) {
    redirect("/");
  }

  return (
    <div>
      <h1>{thisPageDay.toLocaleString("default", { month: "long", day: "numeric" })}</h1>
      <ul>
        {[1,2,3].map((p) => (
          <li key={p}>
            <Link href={"/daily/" + year + "/" + month.toString() + "/" + day + "/" + p}>
              {"Puzzle " + p}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
