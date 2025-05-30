import { SwishInterface } from "@/app/game/SwishInterface"
import { getGame } from "@/sheetsDB/getGamesList"


export default async function PlayTestGame({params}){
    const {gameId} =await params
    const game = await getGame(gameId)
    return     <div>
          {game == null ? <p>Loading game</p> : <SwishInterface game={game} />}
        </div>
}