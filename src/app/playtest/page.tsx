import { getGamesList } from "@/sheetsDB/getGamesList"

 export default  async function PlayTestGames() {
    const gameIds = await getGamesList()

    return <ul>
        {gameIds.map(g => {
           return <li key={g}><button>{g}</button></li>
        })}
    </ul>
}