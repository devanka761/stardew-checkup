export interface IKeyValueList {
  [key: string]: number
}

export interface ISpriteValue {
  [key: string]: number | string
}
export interface ISpriteValues {
  [key: string]: number | string | ISpriteValue
}

export interface ISprite {
  hair: number
  skin: number
  accessory?: number
  hairstyleColor: { R: number; G: number; B: number; A: number }
  newEyeColor: { R: number; G: number; B: number; A: number }
  hat?: { itemId: string | number; hairDrawType: number }
  shirtItem?: { itemId: string | number; clothesColor: { R: number; G: number; B: number; A: number } }
  pantsItem?: { itemId: string | number; clothesColor: { R: number; G: number; B: number; A: number } }
}

export interface IMineLevel {
  mine: number
  skullCavern: number
}

export interface IPlayer {
  isHost: boolean
  umid: string
  name: string
  playTime: number
  gender: string
  totalMoneyEarned: number
  individualMoneyEarned: number
  spouse: string
  basicShipped: IKeyValueList
  deepestMineLevel: IMineLevel
  monstersKilled: IKeyValueList
  friendship: IKeyValueList
  experiencePoints: number[]
  masteryExp: number
  masteryPerks: string[]
  questsCompleted: number
  stardrops: string[]
  recipesCooked: IKeyValueList
  craftingRecipes: IKeyValueList
  fishCaught: IKeyValueList
  sprite: ISprite
  ceremonySeen?: string
}
