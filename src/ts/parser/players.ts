import { IKeyValueList, IPlayer, ISpriteValue, ISpriteValues } from "../types/player.types"

interface IIdentity {
  name: (data: ISival) => ISival
  playTime: (data: ISival) => ISival
  gender: (data: ISival) => ISival
  totalMoneyEarned: (data: ISival) => ISival
  spouse: (data: ISival) => ISival
  basicShipped: (data: ISival) => ISival
  monstersKilled: (data: ISival) => ISival
  friendship: (data: ISival) => ISival
  experiencePoints: (data: ISival) => ISival
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
  name(data): string {
    return data.name || "Unnamed"
  },

  playTime(data): number {
    return data.millisecondsPlayed || 2
  },

  gender(data): string {
    return data.Gender || "Male"
  },

  totalMoneyEarned(data): number {
    return data.totalMoneyEarned
  },

  spouse(data): string | null {
    return data.spouse || null
  },

  basicShipped(data): IKeyValueList {
    const items: IKeyValueList = {}

    const obj = data.basicShipped?.item || {}

    if (obj.key) {
      items[obj.key.string.toString()] = obj.value.int
    }

    if (Array.isArray(obj)) {
      obj.forEach((itm) => {
        items[itm.key.string.toString()] = itm.value.int
      })
    }

    return items
  },

  monstersKilled(data): IKeyValueList {
    const items: IKeyValueList = {}

    const obj = data.stats?.specificMonstersKilled?.item || {}

    if (obj.key) {
      items[obj.key.string.toString()] = obj.value.int
    }

    if (Array.isArray(obj)) {
      obj.forEach((itm) => {
        items[itm.key.string.toString()] = itm.value.int
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
      items[obj.key.string.toString()] = obj.value.int
    }

    if (Array.isArray(obj)) {
      obj.forEach((itm) => {
        items[itm.key.string.toString()] = itm.value.int
      })
    }

    return items
  },

  craftingRecipes(data): IKeyValueList {
    const items: IKeyValueList = {}

    const obj = data.craftingRecipes?.item || {}

    if (obj.key) {
      items[obj.key.string.toString()] = obj.value.int
    }

    if (Array.isArray(obj)) {
      obj.forEach((itm) => {
        items[itm.key.string.toString()] = itm.value.int
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

  ceremonySeen(data): string | undefined {
    if (!data.previousActiveDialogueEvents || !data.previousActiveDialogueEvents.item || !Array.isArray(data.previousActiveDialogueEvents.item) || data.previousActiveDialogueEvents.item.length < 1) return undefined
    return (
      data.previousActiveDialogueEvents?.item?.find((itm: ISival) => {
        return ["eventSeen_502261", "eventSeen_191393"].find((evt) => evt === (itm.key?.string || "-"))
      })?.key?.string || undefined
    )
  }
}

import { ISival } from "../types/lib.types"

export function getPlayers(players: ISival[]): IPlayer[] {
  return players.map((player) => ({
    isHost: !!player.isHost,
    name: identity.name(player),
    playTime: identity.playTime(player),
    gender: identity.gender(player),
    totalMoneyEarned: identity.totalMoneyEarned(player),
    spouse: identity.spouse(player),
    basicShipped: identity.basicShipped(player),
    monstersKilled: identity.monstersKilled(player),
    friendship: identity.friendship(player),
    experiencePoints: identity.experiencePoints(player),
    stardrops: identity.stardrops(player),
    recipesCooked: identity.recipesCooked(player),
    craftingRecipes: identity.craftingRecipes(player),
    fishCaught: identity.fishCaught(player),
    sprite: identity.sprite(player),
    ceremonySeen: identity.ceremonySeen(player)
  }))
}
