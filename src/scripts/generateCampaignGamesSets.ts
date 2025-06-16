import { campaignDefinition } from "@/game/campaign/campaign";
import { CountdownGame } from "@/game/common/CountdownGame";
import { generateGame } from "@/game/game-generation";
import { GetSheetDoc } from "@/sheetsDB/GetSheetDoc";

const doc = await GetSheetDoc();

const sheet = doc.sheetsByTitle["CampaignGames"];

const existingRows = await sheet.getRows();
const existingIds: string[] = existingRows.map((r) => r.get("Id"));

type Todo = {
  game: CountdownGame;
  id: string;
};

const todos: Todo[] = [];

for (const s of campaignDefinition.sets) {
  const idRoot = s.id;
  for (const g of s.games) {
    const id = `${idRoot}/${g.id}`;
    if (existingIds.includes(id)) {
      console.log(`Id ${id} already exists - skipping`);
      continue;
    }
    console.log(`Generating Id ${id}`);
    const game = generateGame(g.profile);

    todos.push({
      game,
      id,
    });
  }
}

console.log("Uploading games...");

await sheet.addRows(
  todos.map((t) => {
    return {
      Id: t.id,
      Cards: JSON.stringify(t.game.cards),
      Target: JSON.stringify(t.game.target),
      Solution: JSON.stringify(t.game.solution),
    };
  }),
);

console.log("Done");
