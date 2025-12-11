import stardrops from "../../json/sdvEntity/stardrops.json"
import { PrimarySection } from "../types/section.types"
import { eroot, kel } from "../lib/kel"
import { sections } from "./SectionManager"
import { IPlayer } from "../types/player.types"

function getInfoMaxStamina(player: IPlayer): HTMLLIElement {
  const li = kel("li")

  const maxReq = 508
  const maxStamina = player.maxStamina

  li.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-star"></i></span> <b>${player.name}</b> has ${maxStamina}/${maxReq} max stamina`

  return li
}

function getStardropList(playerStardrops: string[]): HTMLLIElement[] {
  const stardropsList: HTMLLIElement[] = Object.keys(stardrops)
    .sort((a, b) => {
      if (playerStardrops.some((id) => id === a)) return 1
      if (playerStardrops.some((id) => id === b)) return -1
      return 0
    })
    .map((k) => {
      const key = k as keyof typeof stardrops
      const isDone = playerStardrops.some((id) => id === k)

      const li = kel("li", "goal")

      if (isDone) li.classList.add("done")

      const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
      const liText = `<span class='fa-li'><i class="${icon}"></i></span> ${stardrops[key]}`

      li.innerHTML = liText

      return li
    })

  return stardropsList
}

function getEveryStardropFound(playerStardrops: string[]): HTMLLIElement {
  const reqStardrops = Object.keys(stardrops).length
  const currStardrops = playerStardrops.length

  const isDone = currStardrops >= reqStardrops

  const li = kel("li", "goal")
  const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
  const liText = `<span class='fa-li'><i class="${icon}"></i></span> Mystery Of The Stardrops (find every stardrop)`
  li.innerHTML = liText

  const status = kel("span", "status")
  li.append(status)

  if (isDone) {
    li.classList.add("done")
    status.innerHTML = ` achieved`
  } else {
    status.innerHTML = ` -- need ${reqStardrops - currStardrops} more`
  }

  const ulStardrops = kel("ul", "fa-ul")

  const stardropList = getStardropList(playerStardrops)

  ulStardrops.append(...stardropList)

  li.append(ulStardrops)

  return li
}

function getInfoStardrops(player: IPlayer): HTMLLIElement {
  const reqStardrops = Object.keys(stardrops).length
  const currStardrops = player.stardrops.length

  const li = kel("li")

  li.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-star"></i></span> <b>${player.name}</b> has markers for ${currStardrops} of ${reqStardrops} stardrops`

  const ulAchieve = kel("ul", "fa-ul")

  const everyStardropFound = getEveryStardropFound(player.stardrops)

  ulAchieve.append(everyStardropFound)

  li.append(ulAchieve)

  return li
}

export default class Stardrops implements PrimarySection {
  readonly id: string = "stardrops"

  private el: HTMLElement = kel("section", "sect content stardrops", { a: { id: "data-stardrops" } })

  constructor(private players: IPlayer[]) {}

  createElement(): void {
    const showHide = this.showHide()

    const title = kel("div", "title", { e: ['<h2><i class="fa-duotone fa-hashtag fa-fw"></i> Stardrops</h2>', showHide] })

    const field = kel("div", "field")

    this.players.forEach((player) => {
      const card = kel("div", "card")
      const ulRoot = kel("ul", "fa-ul")

      card.append(ulRoot)
      field.append(card)

      const infoMaxStamina = getInfoMaxStamina(player)
      const infoStardrops = getInfoStardrops(player)

      ulRoot.append(infoMaxStamina, infoStardrops)
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
    sections.stardrops = this
    this.createElement()
    eroot().append(this.el)
  }
}
