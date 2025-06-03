import { Tier1Bucket, Tier2Bucket, Tier3Bucket } from "@/game-generation/flavours/Flavour";
import { GameProfile, generateGame} from "@/game-generation/game-generation"
import { GetSheetDoc } from "@/sheetsDB/GetSheetDoc"

const doc = await GetSheetDoc()
const configSheet = doc.sheetsByTitle["Config"]
const config = await configSheet.getRows()
const configRow = config.filter(c => c.get("Key") == "NextDateToGenerate")[0]
const nextDateToGenerate: string = configRow.get("Value")
const d: Date = new Date(nextDateToGenerate)

const year = d.getFullYear()
const month = d.getMonth() + 1
const daysCount = new Date(year, month, 0).getDate()

function pickFrom<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
}

const sheet = doc.sheetsByTitle["DailyGames"]
for (let day = 1; day <= daysCount; day++) {
    const dateVal = [year, month, day].join('/')
    const game1Profile: GameProfile = {
        bigsCount: pickFrom([2, 3]),
        nonsenseCounts: 2,
        useExpertBigs: false,
        legalNonsense: Tier1Bucket
    }
    const game2Profile: GameProfile = {
        bigsCount: pickFrom([1, 2, 3]),
        nonsenseCounts: 3,
        useExpertBigs: false,
        legalNonsense: Tier2Bucket
    }
    const game3Profile: GameProfile = {
        bigsCount: pickFrom([0, 1, 2, 3, 4]),
        nonsenseCounts: 4,
        useExpertBigs: true,
        legalNonsense: Tier3Bucket
    }
    console.log("Day " + day)
    console.log("Game 1")
    const game1 = generateGame(game1Profile)
     console.log("Game 2")
    const game2 = generateGame(game2Profile)
     console.log("Game 3")
    const game3 = generateGame(game3Profile)
    const rows = [
        {
        Date: dateVal,
        Index: 1,
        Cards: JSON.stringify(game1.cards),
        Target: JSON.stringify(game1.target),
        Solution: JSON.stringify(game1.solution)
    },
    {
        Date: dateVal,
        Index: 2,
        Cards: JSON.stringify(game2.cards),
        Target: JSON.stringify(game2.target),
        Solution: JSON.stringify(game2.solution)
    },
    {
        Date: dateVal,
        Index: 3,
        Cards: JSON.stringify(game3.cards),
        Target: JSON.stringify(game3.target),
        Solution: JSON.stringify(game3.solution)
    }
    ]
    await sheet.addRows(rows)
}

d.setMonth(d.getMonth() + 1)
configRow.set("Value",d.toISOString())
configRow.save() 