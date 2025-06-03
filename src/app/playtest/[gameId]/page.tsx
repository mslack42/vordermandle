import { SwishInterface } from "@/components/SwishInterface"
import { getGame } from "@/sheetsDB/getGamesList"

export default async function PlayTestGame({params}: {params:Promise<{gameId:string}>}){
    const {gameId} =await params
    const game = await getGame(gameId)
    return     <div>
          {game == null ? <p>Loading game</p> : <SwishInterface game={game} />}
        </div>
}