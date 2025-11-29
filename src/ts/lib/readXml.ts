import { XMLParser } from "fast-xml-parser"
import { ISival } from "../types/lib.types"
import { getPlayers } from "../parser/players"
import { ISaveGame } from "../types/saveFile.types"

interface ISaveFile {
  ok: boolean
  data?: ISaveGame
}

const farmType = { "0": "Standard Farm", "1": "Riverland Farm", "2": "Forest Farm", "3": "Hilltop Farm", "4": "Wilderness Farm", "5": "Four Corners Farm", "6": "Beach Farm", "7": "Meadowlands Farm", MeadowlandsFarm: "Meadowlands Farm" }

export function readSaveFile(file: ISival): ISaveFile {
  const parser = new XMLParser()

  const converted = parser.parse(file)
  if (!converted.SaveGame) return { ok: false }

  const saveGame = converted.SaveGame
  // console.log(saveGame)

  if (!saveGame.player) return { ok: false }

  const farmhands = saveGame.farmhands?.Farmer || []
  const players = getPlayers([{ ...saveGame.player, isHost: true }, ...farmhands])
  const farmName = saveGame.player.farmName
  const whichFarm = farmType[saveGame.whichFarm as keyof typeof farmType]
  if (!whichFarm) return { ok: false }
  const separateWallets = !!saveGame.player.useSeparateWallets

  const year = saveGame.year
  if (typeof year !== "number") return { ok: false }

  const dayOfMonth = saveGame.dayOfMonth
  if (typeof dayOfMonth !== "number") return { ok: false }

  const currentSeason = saveGame.currentSeason
  if (!currentSeason) return { ok: false }

  const uniqueID = saveGame.uniqueIDForThisGame
  if (typeof uniqueID === "undefined" || uniqueID === null) return { ok: false }

  const ceremonySeen = players.find((p) => p.ceremonySeen)?.ceremonySeen

  const gameVersion = saveGame.gameVersion

  const data: ISaveGame = {
    players,
    farmName,
    separateWallets,
    whichFarm,
    year,
    dayOfMonth,
    currentSeason,
    uniqueID,
    ceremonySeen,
    gameVersion
  }

  return {
    ok: true,
    data
  }
}
