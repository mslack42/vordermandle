import { CountdownGame } from "@/game/common/CountdownGame";
import { getCampaignGameById } from "@/sheetsDB/getGamesList";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { CampaignGame } from "./CampaignGame";

type RouteParams = {
  group: string;
  index: string;
};

const getCampaignGame = unstable_cache(
  async (group: string, index: string) => {
    return getCampaignGameById(group, index);
  },
  [],
  {
    revalidate: 300,
  },
);

export default async function CampaignGameAtIndex({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { group, index } = await params;

  let game: CountdownGame;
  try {
    game = await getCampaignGame(group, index);
  } catch {
    redirect("/");
  }

  return <CampaignGame game={game} gameId={`${group}/${index}`} />;
}
