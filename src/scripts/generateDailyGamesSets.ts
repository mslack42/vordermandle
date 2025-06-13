import { Tier1Bucket, Tier2Bucket, Tier3Bucket } from "@/game/flavours/Flavour";
import { GameProfile, generateGame } from "@/game/game-generation";
import { GetSheetDoc } from "@/sheetsDB/GetSheetDoc";

const doc = await GetSheetDoc();
const configSheet = doc.sheetsByTitle["Config"];
const config = await configSheet.getRows();
const configRow = config.filter((c) => c.get("Key") == "NextDateToGenerate")[0];
const nextDateToGenerate: string = configRow.get("Value");
const d: Date = new Date(nextDateToGenerate);

const year = d.getFullYear();
const month = d.getMonth() + 1;
const daysCount = new Date(year, month, 0).getDate();

function pickFromWithProbability<T>(arr: T[], ws: number[]): T {
  const sumOfWeights = ws.reduce((prev, curr) => prev + curr, 0);
  const roll = Math.floor(Math.random() * sumOfWeights);
  let acc = 0;
  let index = 0;
  for (const w of ws) {
    acc += w;
    if (acc > roll) {
      return arr[index];
    }
    index += 1;
  }
  return arr[0];
}

const sheet = doc.sheetsByTitle["DailyGamesInParts"];
for (let day = 1; day <= daysCount; day++) {
  const dateVal = [year, month, day].join("/");
  const easyProfile: GameProfile = {
    bigsCount: pickFromWithProbability([1, 2, 3], [15, 30, 30]),
    nonsenseCounts: pickFromWithProbability([0, 1], [1, 50]),
    useExpertBigs: pickFromWithProbability([true, false], [4, 10]),
    legalNonsense: Tier1Bucket,
    difficultyAllowance: 1.8,
  };
  const medProfile: GameProfile = {
    bigsCount: pickFromWithProbability([0, 1, 2, 3, 4], [5, 30, 30, 10, 5]),
    nonsenseCounts: pickFromWithProbability([1, 2], [50, 20]),
    useExpertBigs: pickFromWithProbability([true, false], [1, 10]),
    legalNonsense: Tier2Bucket,
    difficultyAllowance: 1.4,
  };
  const hardProfile: GameProfile = {
    bigsCount: pickFromWithProbability([0, 1, 2, 3, 4], [8, 25, 25, 10, 8]),
    nonsenseCounts: pickFromWithProbability([1, 2, 3], [10, 40, 1]),
    useExpertBigs: pickFromWithProbability([true, false], [1, 10]),
    legalNonsense: Tier3Bucket,
    difficultyAllowance: 1.1,
  };
  console.log("Day " + day);
  console.log("Easy");
  const easy = generateGame(easyProfile);
  console.log("Medium");
  const medium = generateGame(medProfile);
  console.log("Hard");
  const hard = generateGame(hardProfile);
  const rows = [
    {
      Date: dateVal,
      Level: 1,
      Cards: JSON.stringify(easy.cards),
      Target: JSON.stringify(easy.target),
      Solution: JSON.stringify(easy.solution),
    },
    {
      Date: dateVal,
      Level: 2,
      Cards: JSON.stringify(medium.cards),
      Target: JSON.stringify(medium.target),
      Solution: JSON.stringify(medium.solution),
    },
    {
      Date: dateVal,
      Level: 3,
      Cards: JSON.stringify(hard.cards),
      Target: JSON.stringify(hard.target),
      Solution: JSON.stringify(hard.solution),
    },
  ];
  await sheet.addRows(rows);
}

d.setMonth(d.getMonth() + 1);
configRow.set("Value", d.toISOString());
configRow.save();
