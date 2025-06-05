import { Tier1Bucket, Tier2Bucket, Tier3Bucket } from "@/game/flavours/Flavour";
import { GameProfile, generateGame} from "@/game/game-generation"
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

function pickFromWithProbability<T>(arr:T[],ws: number[]): T {
    const sumOfWeights = ws.reduce((prev,curr) => prev + curr,0)
    const roll = Math.floor(Math.random() * sumOfWeights)
    let acc = 0
    let index = 0
    for (const w of ws) {
        acc += w
        if (acc > roll) {
            return arr[index]
        }
        index += 1
    }
    return arr[0]
}

const sheet = doc.sheetsByTitle["DailyGames"]
for (let day = 1; day <= daysCount; day++) {
    const dateVal = [year, month, day].join('/')
    const gameProfile: GameProfile = {
        bigsCount: pickFromWithProbability([0,1,2, 3,4],[5,30,30,10,5]),
        nonsenseCounts: pickFromWithProbability([0,1,2],[1,30,50]),
        useExpertBigs: pickFromWithProbability([true,false],[1,10]),
        legalNonsense: pickFromWithProbability([Tier1Bucket, Tier2Bucket, Tier3Bucket],[20,50,30])
    }
    console.log("Day " + day)
    const game = generateGame(gameProfile)
    const rows = [
        {
        Date: dateVal,
        Cards: JSON.stringify(game.cards),
        Target: JSON.stringify(game.target),
        Solution: JSON.stringify(game.solution)
    }
    ]
    await sheet.addRows(rows)
}

d.setMonth(d.getMonth() + 1)
configRow.set("Value",d.toISOString())
configRow.save() 