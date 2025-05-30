import { CountdownGame } from "@/game-generation/common/CountdownGame"
import { GetSheetDoc } from "./GetSheetDoc"

export async function getGamesList():Promise<string[]>{
    const doc = await GetSheetDoc()
    const sheet = doc.sheetsByTitle["Games"]

    const rows =(await sheet.getRows())

    return rows.map(r => r.toObject()).map(r => r["Id"])
}

export async function getGame(id:string):Promise<CountdownGame>{
    const doc = await GetSheetDoc()
    const sheet = doc.sheetsByTitle["Games"]

    const rows =(await sheet.getRows())

    const match = rows.map(r => r.toObject()).filter(r => r["Id"] == id)
    if (match.length == 0) {
        throw Error()
    }
    return {
        cards: JSON.parse(match[0]['Cards']),
        target: JSON.parse(match[0]['Target']),
        solution: JSON.parse(match[0]['Solution'])
    }
}