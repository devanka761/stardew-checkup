import { XMLParser } from "fast-xml-parser"
import { ISival } from "../types/lib.types"
import { getPlayers } from "../parser/players"
import { ISaveGame } from "../types/saveFile.types"

interface ISaveFile {
  ok: boolean
  data?: ISaveGame
}

const farmType = { "0": "Standard Farm", "1": "Riverland Farm", "2": "Forest Farm", "3": "Hilltop Farm", "4": "Wilderness Farm", "5": "Four Corners Farm", "6": "Beach Farm", "7": "Meadowlands Farm" }

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

  const year = saveGame.year
  const dayOfMonth = saveGame.dayOfMonth
  const currentSeason = saveGame.currentSeason
  const uniqueID = saveGame.uniqueIDForThisGame
  const ceremonySeen = "eventSeen_502261"
  // const hasSeenCeremony = saveGame.player.previousActiveDialogueEvents?.item?.find(itm => {
  //   return ["eventSeen_502261", "eventSeen_191393"].includes(itm.key?.string?._text || "-");
  // }).key?.string?._text || null;

  const data: ISaveGame = {
    players,
    farmName,
    whichFarm,
    year,
    dayOfMonth,
    currentSeason,
    uniqueID,
    ceremonySeen
  }

  return {
    ok: true,
    data
  }
}
