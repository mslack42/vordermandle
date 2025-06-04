import { CountdownGame } from "@/game-generation/common/CountdownGame"
import { GetSheetDoc } from "./GetSheetDoc"
import { cache } from "react"

export const getGamesList = cache(async () => {
    const doc = await GetSheetDoc()
    const sheet = doc.sheetsByTitle["Games"]

    const rows =(await sheet.getRows())

    return rows.map(r => r.toObject()).map(r => r["Id"])
})

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

export async function getGameByDate(
    year: number,
    month: number,
    day:number,
):Promise<CountdownGame>{
    const dateString = [year,month,day].join('/')
    const doc = await GetSheetDoc()
    const sheet = doc.sheetsByTitle["DailyGames"]
    
    const rows =(await sheet.getRows())
    
    const match = rows.map(r => r.toObject()).filter(r => r["Date"] == dateString)
    if (match.length == 0) {
        throw Error()
    }
    return {
        cards: JSON.parse(match[0]['Cards']),
        target: JSON.parse(match[0]['Target']),
        solution: JSON.parse(match[0]['Solution'])
    }
}