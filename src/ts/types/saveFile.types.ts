import { IPlayer } from "./player.types"

export interface ISaveGame {
  players: IPlayer[]
  farmName: string
  whichFarm: string
  separateWallets: boolean
  year: number
  dayOfMonth: number
  currentSeason: string
  uniqueID: number
  ceremonySeen?: string
  gameVersion: string
}
