import { IKeyValueList, IMineLevel, IPlayer, ISpriteValue, ISpriteValues } from "../types/player.types"
import detail_skills from "../../json/sdvDetail/detail_skills.json"

interface IIdentity {
  umid: (data: ISival) => ISival
  name: (data: ISival) => ISival
  playTime: (data: ISival) => ISival
  gender: (data: ISival) => ISival
  totalMoneyEarned: (data: ISival) => ISival
  individualMoneyEarned: (data: ISival) => ISival
  spouse: (data: ISival) => ISival
  basicShipped: (data: ISival) => ISival
  deepestMineLevel: (data: ISival) => ISival
  monstersKilled: (data: ISival) => ISival
  friendship: (data: ISival) => ISival
  experiencePoints: (data: ISival) => ISival
  masteryExp: (data: ISival) => ISival
  masteryPerks: (data: ISival) => ISival
  questsCompleted: (data: ISival) => ISival
  stardrops: (data: ISival) => ISival
  recipesCooked: (data: ISival) => ISival
  craftingRecipes: (data: ISival) => ISival
  fishCaught: (data: ISival) => ISival
  sprite: (data: ISival) => ISival
  ceremonySeen: (data: ISival) => ISival
}

const playerSprite = {
  hair: "string/number",
  skin: "string/number",
  accessory: "string/number",
  hairstyleColor: { R: "string/number", G: "string/number", B: "string/number", A: "string/number" },
  newEyeColor: { R: "string/number", G: "string/number", B: "string/number", A: "string/number" },
  hat: { itemId: "string/number", hairDrawType: "string/number" },
  shirtItem: { itemId: "string/number", clothesColor: { R: "string/number", G: "string/number", B: "string/number", A: "string/number" } },
  pantsItem: { itemId: "string/number", clothesColor: { R: "string/number", G: "string/number", B: "string/number", A: "string/number" } }
}

function transformSprite(curPlayerData: ISival, newPlayerData: ISival): ISpriteValues {
  const result: ISpriteValues = {}

  for (const key in newPlayerData) {
    if (newPlayerData[key as keyof typeof newPlayerData]) {
      const valueType = newPlayerData[key as keyof typeof newPlayerData]

      if (typeof valueType === "object" && valueType !== null) {
        if (curPlayerData[key]) {
          result[key] = transformSprite(curPlayerData[key], valueType) as ISpriteValue
        }
      } else {
        if (curPlayerData[key] !== undefined) {
          const value = curPlayerData[key]

          result[key] = value
        }
      }
    }
  }
  return result
}

const identity: IIdentity = {
  umid(data): string {
    return data.UniqueMultiplayerID.toString()
  },

  name(data): string {
    return data.name?.length >= 1 ? data.name : "Unnamed"
  },

  playTime(data): number {
    return data.millisecondsPlayed || 2
  },

  gender(data): string {
    return data.Gender?.length >= 1 ? data.Gender : "Male"
  },

  totalMoneyEarned(data): number {
    return Number(data.totalMoneyEarned)
  },

  individualMoneyEarned(data): number {
    const oldObj = data.stats?.individualMoneyEarned

    if (typeof oldObj === "number") {
      return data.stats.individualMoneyEarned
    }

    const obj = data.stats?.Values?.item || {}

    if (obj?.key?.string?.toString() === "individualMoneyEarned") {
      if (obj?.value) {
        const anyValue = Object.values(obj.value)[0]
        if (typeof anyValue !== "undefined") return anyValue as number
      }
    }

    if (Array.isArray(obj)) {
      const item = obj.find((itm) => itm.key?.string?.toString() === "individualMoneyEarned")

      if (item?.value) {
        const anyValue = Object.values(item.value)[0]
        if (typeof anyValue !== "undefined") return anyValue as number
      }
    }

    return 0
  },

  spouse(data): string | null {
    return data.spouse?.length >= 1 ? data.spouse : null
  },

  basicShipped(data): IKeyValueList {
    const items: IKeyValueList = {}

    const obj = data.basicShipped?.item || {}

    if (obj.key) {
      items[obj.key.string.toString()] = Object.values(obj.value)[0] as number
    }

    if (Array.isArray(obj)) {
      obj.forEach((itm) => {
        items[itm.key.string.toString()] = Object.values(itm.value)[0] as number
      })
    }

    return items
  },

  deepestMineLevel(data): IMineLevel {
    const hasSkullKey = data.hasSkullKey?.toString() === "true" ? true : false

    let mineLevel = typeof data.deepestMineLevel === "number" ? data.deepestMineLevel : 0

    if (hasSkullKey) {
      mineLevel = Math.max(120, mineLevel)
    }

    return {
      mine: Math.min(mineLevel, 120),
      skullCavern: mineLevel > 120 ? mineLevel - 120 : 0
    }
  },

  monstersKilled(data): IKeyValueList {
    const items: IKeyValueList = {}

    const obj = data.stats?.specificMonstersKilled?.item || {}

    if (obj.key) {
      items[obj.key.string.toString()] = Object.values(obj.value)[0] as number
    }

    if (Array.isArray(obj)) {
      obj.forEach((itm) => {
        items[itm.key.string.toString()] = Object.values(itm.value)[0] as number
      })
    }

    return items
  },

  friendship(data): IKeyValueList {
    const items: IKeyValueList = {}

    const obj = data.friendshipData?.item || {}

    if (obj.key) {
      items[obj.key.string] = obj.value.Friendship.Points
      return items
    }

    if (Array.isArray(obj)) {
      obj.forEach((itm) => {
        items[itm.key.string] = itm.value.Friendship.Points
      })
    }

    return items
  },

  experiencePoints(data): number[] {
    const obj = data.experiencePoints?.int || []

    if (Array.isArray(obj)) {
      return obj.map(Number)
    }

    return [0, 0, 0, 0, 0, 0]
  },

  masteryExp(data): number {
    const oldObj = data.stats?.MasteryExp

    if (typeof oldObj === "number") {
      return data.stats.MasteryExp
    }

    const obj = data.stats?.Values?.item || {}

    if (obj?.key?.string?.toString() === "MasteryExp") {
      if (obj?.value) {
        const anyValue = Object.values(obj.value)[0]
        if (typeof anyValue !== "undefined") return anyValue as number
      }
    }

    if (Array.isArray(obj)) {
      const item = obj.find((itm) => itm.key?.string?.toString() === "MasteryExp")

      if (item?.value) {
        const anyValue = Object.values(item.value)[0]
        if (typeof anyValue !== "undefined") return anyValue as number
      }
    }

    return 0
  },

  masteryPerks(data): string[] {
    const skills = detail_skills.skills

    const perks: string[] = []

    for (let i = 0; i < skills.length; i++) {
      const perkId = `mastery_${i}`

      const oldObj = data.stats?.[perkId]

      if (typeof oldObj === "number" && oldObj >= 1) {
        perks.push(perkId)
      }

      const obj = data.stats?.Values?.item || {}

      if (obj?.key?.string?.toString() === perkId) {
        if (obj?.value) {
          const anyValue = Object.values(obj.value)[0]
          if (anyValue) perks.push(perkId)
        }
      }

      if (Array.isArray(obj)) {
        const item = obj.find((itm) => itm.key?.string?.toString() === perkId)

        if (item?.value) {
          const anyValue = Object.values(item.value)[0]
          if (anyValue) perks.push(perkId)
        }
      }
    }

    return perks
  },
  questsCompleted(data): number {
    const oldObj = data.stats?.questsCompleted

    if (typeof oldObj === "number") {
      return data.stats.questsCompleted
    }

    const obj = data.stats?.Values?.item || {}

    if (obj?.key?.string?.toString() === "questsCompleted") {
      if (obj?.value) {
        const anyValue = Object.values(obj.value)[0]
        if (typeof anyValue !== "undefined") return anyValue as number
      }
    }

    if (Array.isArray(obj)) {
      const item = obj.find((itm) => itm.key?.string?.toString() === "questsCompleted")

      if (item?.value) {
        const anyValue = Object.values(item.value)[0]
        if (typeof anyValue !== "undefined") return anyValue as number
      }
    }

    return 0
  },
  stardrops(data): string[] {
    const items: string[] = []

    const obj = data.mailReceived?.string || ""

    if (typeof obj === "string" && (obj.includes("CF_") || obj.includes("museumComplete"))) {
      items.push(obj)
    }

    if (Array.isArray(obj)) {
      obj
        .filter((itm) => typeof itm === "string" && (itm.includes("CF_") || itm.includes("museumComplete")))
        .forEach((itm) => {
          items.push(itm)
        })
    }

    return items
  },

  recipesCooked(data): IKeyValueList {
    const items: IKeyValueList = {}

    const obj = data.recipesCooked?.item || {}

    if (obj.key) {
      items[obj.key.string.toString()] = Object.values(obj.value)[0] as number
    }

    if (Array.isArray(obj)) {
      obj.forEach((itm) => {
        items[itm.key.string.toString()] = Object.values(itm.value)[0] as number
      })
    }

    return items
  },

  craftingRecipes(data): IKeyValueList {
    const items: IKeyValueList = {}

    const obj = data.craftingRecipes?.item || {}

    if (obj.key) {
      items[obj.key.string.toString()] = Object.values(obj.value)[0] as number
    }

    if (Array.isArray(obj)) {
      obj.forEach((itm) => {
        items[itm.key.string.toString()] = Object.values(itm.value)[0] as number
      })
    }

    return items
  },

  fishCaught(p): IKeyValueList {
    const items: IKeyValueList = {}
    const obj = p.fishCaught?.item || {}

    if (obj.key) {
      const rawId = obj.key.string

      const objKey = rawId.includes(")") ? rawId.split(")")[1] : rawId
      items[objKey] = obj.value.ArrayOfInt?.int?.[0] || 0
    }

    if (Array.isArray(obj)) {
      obj.forEach((itm) => {
        const rawId = itm.key.string

        const itmKey = rawId.includes(")") ? rawId.split(")")[1] : rawId

        items[itmKey] = itm.value.ArrayOfInt?.int?.[0] || 0
      })
    }

    return items
  },

  sprite(data): ISpriteValues {
    return transformSprite(data, playerSprite)
  },

  ceremonySeen(data): string | null {
    if (!data.previousActiveDialogueEvents || !data.previousActiveDialogueEvents.item || !Array.isArray(data.previousActiveDialogueEvents.item) || data.previousActiveDialogueEvents.item.length < 1) return null
    return (
      data.previousActiveDialogueEvents?.item?.find((itm: ISival) => {
        return ["eventSeen_502261", "eventSeen_191393"].find((evt) => evt === (itm.key?.string || "-"))
      })?.key?.string || null
    )
  }
}

import { ISival } from "../types/lib.types"

export function getPlayers(players: ISival[]): IPlayer[] {
  return players
    .filter((player, i) => {
      return i === 0 || (player.userID?.toString().length >= 1 && player.name?.toString().length >= 1)
    })
    .map((player) => ({
      isHost: !!player.isHost,
      umid: identity.umid(player),
      name: identity.name(player),
      playTime: identity.playTime(player),
      gender: identity.gender(player),
      totalMoneyEarned: identity.totalMoneyEarned(player),
      individualMoneyEarned: identity.individualMoneyEarned(player),
      spouse: identity.spouse(player),
      basicShipped: identity.basicShipped(player),
      deepestMineLevel: identity.deepestMineLevel(player),
      monstersKilled: identity.monstersKilled(player),
      friendship: identity.friendship(player),
      experiencePoints: identity.experiencePoints(player),
      masteryExp: identity.masteryExp(player),
      masteryPerks: identity.masteryPerks(player),
      questsCompleted: identity.questsCompleted(player),
      stardrops: identity.stardrops(player),
      recipesCooked: identity.recipesCooked(player),
      craftingRecipes: identity.craftingRecipes(player),
      fishCaught: identity.fishCaught(player),
      sprite: identity.sprite(player),
      ceremonySeen: identity.ceremonySeen(player)
    }))
}
