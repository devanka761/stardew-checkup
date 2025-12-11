import monsters from "../../json/sdvEntity/monsters.json"
import { PrimarySection } from "../types/section.types"
import { eroot, kel } from "../lib/kel"
import { sections } from "./SectionManager"
import { IKeyValueList, IPlayer } from "../types/player.types"
import { toAnchor } from "../lib/toAnchor"
import { toCommas } from "../lib/toCommas"

function getTheBottomLevel(mineLevel: number): HTMLLIElement {
  const reqLevel = 120
  const isDone = mineLevel >= reqLevel

  const li = kel("li", "goal")
  const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
  const liText = `<span class='fa-li'><i class="${icon}"></i></span> The Bottom (reach mine level 120)`
  li.innerHTML = liText

  const status = kel("span", "status")
  li.append(status)

  if (isDone) {
    li.classList.add("done")
    status.innerHTML = ` achieved`
  } else {
    status.innerHTML = ` -- need ${reqLevel - mineLevel} more`
  }

  return li
}

function getInfoLocalMine(player: IPlayer): HTMLLIElement {
  const localMine = player.deepestMineLevel.mine

  const li = kel("li")
  li.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-pickaxe"></i></span> <b>${player.name}</b> `
  if (localMine >= 1) {
    li.innerHTML += `has reached level ${localMine} of the mines`
  } else {
    li.innerHTML += "has not yet explored the mines"
  }

  const ulAchieve = kel("ul", "fa-ul")

  const infoTheBottom = getTheBottomLevel(player.deepestMineLevel.mine)

  ulAchieve.append(infoTheBottom)

  li.append(ulAchieve)

  return li
}

function getInfoSkullCavern(player: IPlayer): HTMLLIElement {
  const skullCavern = player.deepestMineLevel.skullCavern
  const li = kel("li")
  li.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-skull"></i></span> <b>${player.name}</b> `
  if (skullCavern >= 1) {
    li.innerHTML += `has reached level ${toCommas(skullCavern)} of the Skull Cavern`
  } else {
    li.innerHTML += "has not yet explored the Skull Cavern"
  }

  return li
}

function getGuildAccess(kills: number): HTMLLIElement {
  const reqKill = 1000
  const isDone = kills >= reqKill

  const li = kel("li", "goal")
  const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
  const liText = `<span class='fa-li'><i class="${icon}"></i></span> Gain access to the Adventure Guild back room`
  li.innerHTML = liText

  if (isDone) {
    li.classList.add("done")
  } else {
    const status = kel("span", "status")
    status.innerHTML = ` -- need to kill ${reqKill - kills} more`
    li.append(status)
  }

  return li
}

function getTotalKills(player: IPlayer, kills: number): HTMLLIElement {
  const li = kel("li")
  li.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-sword"></i></span> <b>${player.name}</b> has killed ${toCommas(kills)} monster(s)`

  const ulAchieve = kel("ul", "fa-ul")

  const infoGuildAccess = getGuildAccess(kills)

  ulAchieve.append(infoGuildAccess)

  li.append(ulAchieve)

  return li
}

function getCategoryRemaining(categoriesKilled: IKeyValueList, goals: typeof monsters.goals): HTMLLIElement[] {
  const categoriesNeed: HTMLLIElement[] = Object.keys(goals)
    .filter((k) => {
      const key = k as keyof typeof goals
      return !categoriesKilled[k] || categoriesKilled[k] < goals[key]
    })
    .sort()
    .map((k) => {
      const key = k as keyof typeof goals

      const monsterList = monsters.cagetories[key]
        .map(
          (monsterName) =>
            toAnchor(monsterName, `https://stardewvalleywiki.com/${monsterName}`, {
              blank: true,
              asText: true
            }) as string
        )
        .join(", ")

      const li = kel("li", "goal")

      li.innerHTML = `[${categoriesKilled[key]}/${goals[key]}] ${k}`
      const status = kel("span", "status")
      status.innerHTML = ` -- kill ${goals[key] - categoriesKilled[k]} more of: ${monsterList}`

      li.append(status)
      return li
    })

  return categoriesNeed
}
function getCategoryCompleted(categoriesKilled: IKeyValueList, goals: typeof monsters.goals): HTMLLIElement[] {
  const categoriesNeed: HTMLLIElement[] = Object.keys(goals)
    .filter((k) => {
      const key = k as keyof typeof goals
      return categoriesKilled[k] && categoriesKilled[k] >= goals[key]
    })
    .sort()
    .map((k) => {
      const key = k as keyof typeof goals

      const li = kel("li", "goal done")

      const icon = `fa-duotone fa-solid fa-circle-check fa-fw`

      li.innerHTML = `<span class='fa-li'><i class="${icon}"></i></span> ${categoriesKilled[key]}/${goals[key]} ${k}`
      return li
    })

  return categoriesNeed
}

function getMonsterGoals(categoriesKilled: IKeyValueList, goals: typeof monsters.goals, goalsCompleted: number, goalsReq: number): HTMLLIElement {
  const isDone = goalsCompleted >= goalsReq

  const li = kel("li", "goal")
  const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
  const liText = `<span class='fa-li'><i class="${icon}"></i></span> Protector of the Valley (all monster goals)`
  li.innerHTML = liText

  const status = kel("span", "status")
  li.append(status)

  if (isDone) {
    li.classList.add("done")
    status.innerHTML = ` achieved`
  } else {
    status.innerHTML = ` -- need ${goalsReq - goalsCompleted} more`
  }

  const ulCategoryGoals = kel("ol", "fa-ol")

  const categoryRemaining = getCategoryRemaining(categoriesKilled, goals)
  if (categoryRemaining.length >= 1) ulCategoryGoals.append(...categoryRemaining)
  const categoryCompleted = getCategoryCompleted(categoriesKilled, goals)
  if (categoryCompleted.length >= 1) ulCategoryGoals.append(...categoryCompleted)

  li.append(ulCategoryGoals)
  return li
}

function getInfoMonsterEradication(player: IPlayer): HTMLLIElement {
  const categoriesKilled: IKeyValueList = {}

  const enemies = monsters.monsters
  const goals = monsters.goals
  const goalsReq = Object.keys(goals).length

  const killed = player.monstersKilled

  Object.keys(killed).forEach((k) => {
    const enemy = enemies[k as keyof typeof enemies] || "others"
    if (!categoriesKilled[enemy]) categoriesKilled[enemy] = 0
    categoriesKilled[enemy] += killed[k]
  })

  Object.keys(goals).forEach((k) => {
    if (!categoriesKilled[k]) categoriesKilled[k] = 0
  })

  const goalsCompleted = Object.keys(goals)
    .filter((k) => k !== "others")
    .map((k) => {
      if (categoriesKilled[k] >= goals[k as keyof typeof goals]) return 1 as number
      return 0 as number
    })
    .reduce((a, b) => a + b, 0)

  const li = kel("li")
  li.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-shield-halved"></i></span> <b>${player.name}</b> has completed ${goalsCompleted} of the ${goalsReq} Monster Eradication goals`

  const ulAchieve = kel("ul", "fa-ul")
  const monsterGoals = getMonsterGoals(categoriesKilled, goals, goalsCompleted, goalsReq)

  ulAchieve.append(monsterGoals)

  li.append(ulAchieve)

  return li
}

export default class MonsterHunting implements PrimarySection {
  readonly id: string = "monster-hunting"

  private el: HTMLElement = kel("section", "sect content monster-hunting", { a: { id: "data-monster-hunting" } })

  constructor(private players: IPlayer[]) {}

  createElement(): void {
    const showHide = this.showHide()

    const title = kel("div", "title", { e: ['<h2><i class="fa-duotone fa-hashtag fa-fw"></i> Monster Hunting</h2>', showHide] })

    const field = kel("div", "field")

    this.players.forEach((player) => {
      const card = kel("div", "card")
      const ulRoot = kel("ul", "fa-ul")

      card.append(ulRoot)

      field.append(card)

      const infoLocalMine = getInfoLocalMine(player)

      const infoSkullCavern = getInfoSkullCavern(player)

      const kills = Object.values(player.monstersKilled).reduce((a, b) => a + b, 0)

      const infoTotalKills = getTotalKills(player, kills)

      const infoMonsterEradication = getInfoMonsterEradication(player)

      ulRoot.append(infoLocalMine, infoSkullCavern, infoTotalKills, infoMonsterEradication)
    })

    this.el.append(title, field)
  }

  showHide(): HTMLDivElement {
    const btnShowHide = kel("div", "show-hide")
    btnShowHide.innerHTML = `Hide Detail <i class="fa-solid fa-chevron-down"></i>`

    btnShowHide.onclick = () => {
      if (this.el.classList.contains("hide")) {
        btnShowHide.innerHTML = `Hide Detail <i class="fa-solid fa-chevron-down"></i>`
        this.el.classList.remove("hide")
      } else {
        btnShowHide.innerHTML = `Show Detail <i class="fa-solid fa-chevron-right"></i>`
        this.el.classList.add("hide")
      }
    }

    return btnShowHide
  }

  destroy(): void {
    this.el.remove()
    sections.skills = null
  }

  init(): void {
    sections.monsterHunting = this
    this.createElement()
    eroot().append(this.el)
  }
}
