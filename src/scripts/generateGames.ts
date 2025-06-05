import { GameProfile, generateGame, Nonsense } from "@/game/game-generation"
import { GetSheetDoc } from "@/sheetsDB/GetSheetDoc"
import { v4 as uuidv4 } from "uuid";

console.log("Hello World")

const doc = await GetSheetDoc()
const sheet = doc.sheetsByTitle["Games"]

const nonsense: Nonsense[] = [
    // "JUST_AN_EXTRA_NUMBER" - new modifier idea
    //// Below sockets nonsense only seems to run reasonably when they replace 2 numbers (since they spawn numbers, I presume)
    "splitSocket",
    "cloneSocket",
    "partsSocket",
    //// Below socket nonsense seems to run reasonably so long as they replace a number
    "reverseSocket",
    "triangleSocket",
    "squareSocket",
    "rotateSocket",
    "primeSocket",
    "roundSocket",
    //// Below nonsense doesn't seem to slow things down too much
    "incrementOne",
    "decrementOne",
    "incrementMany",
    "reversePlug",
    "rotatePlug",
    "alternate",
    "bigNumber",
    "reversePlug2",
    "rotatePlug2",
    "doublerPlug",
    "targetIncrementOne",
    "targetIncrementMany",
    "targetDecrementOne",
    "targetDecrementMany",
    "targetReverse",
];

for (let i = 0; i < 10; i++) {
    const profile: GameProfile = {
        bigsCount: 2,
        nonsenseCounts: 3,
        useExpertBigs: false,
        legalNonsense: nonsense,
    };
    const game = generateGame(profile)
    await sheet.addRow({
        Id: uuidv4(),
        Flavour: "Test",
        Cards: JSON.stringify(game.cards),
        Target: JSON.stringify(game.target),
        Solution: JSON.stringify(game.solution),
        CompletedCount: 0
    })
}