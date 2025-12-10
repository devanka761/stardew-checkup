import detail_special_orders from "../../json/sdvDetail/detail_special_orders.json"
import { PrimarySection } from "../types/section.types"
import { eroot, kel } from "../lib/kel"
import { sections } from "./SectionManager"
import { IPlayer } from "../types/player.types"
import { ISaveGame } from "../types/saveFile.types"
import { toAnchor } from "../lib/toAnchor"

function getRemaining(quests: string[]): HTMLOListElement {
  const questsReq = Object.keys(detail_special_orders.town)

  const questsRemain = questsReq.filter((townQuest) => !quests.find((quest) => quest === townQuest)).map((quest) => detail_special_orders.town[quest as keyof typeof detail_special_orders.town])

  const questList = questsRemain.sort().map((quest) => {
    const li = kel("li", "goal")

    li.innerHTML = toAnchor(quest, "https://stardewvalleywiki.com/Quests#List_of_Special_Orders", {
      blank: true,
      asText: true,
      className: "cc"
    }) as string
    return li
  })

  const ol = kel("ol", "fa-ol")

  ol.append(...questList)

  return ol
}

function getCompleted(quests: string[]): HTMLUListElement {
  const questsReq = Object.keys(detail_special_orders.town)

  const questCompleted = questsReq.filter((townQuest) => quests.find((quest) => quest === townQuest)).map((quest) => detail_special_orders.town[quest as keyof typeof detail_special_orders.town])

  const questList = questCompleted.sort().map((quest) => {
    const li = kel("li", "goal done")
    const icon = `fa-duotone fa-solid fa-circle-check fa-fw`

    const anchor = toAnchor(quest, "https://stardewvalleywiki.com/Quests#List_of_Special_Orders", {
      blank: true,
      asText: true,
      className: "cc"
    })

    const liText = `<span class='fa-li'><i class="${icon}"></i></span> ${anchor}`
    li.innerHTML = liText
    return li
  })

  const ul = kel("ul", "fa-ul")

  ul.append(...questList)

  return ul
}

function getCompletionSpecialOrders(quests: string[]): HTMLUListElement {
  const doneQuestReq = Object.keys(detail_special_orders.town).length

  const isDone = quests.length >= doneQuestReq

  const li = kel("li", "goal")
  const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
  const liText = `<span class='fa-li'><i class="${icon}"></i></span> Complete all Special Orders`
  li.innerHTML = liText

  if (isDone) {
    li.classList.add("done")
  } else {
    const status = kel("span", "status")
    li.append(status)
    status.innerHTML = ` -- need ${doneQuestReq - quests.length} more`
  }

  const olRemaining = getRemaining(quests)
  const olRemainingParent = kel("li", null, { e: olRemaining })

  const ulCompleted = getCompleted(quests)
  const ulCompletedParent = kel("li", null, { e: ulCompleted })

  li.append(olRemainingParent, ulCompletedParent)

  const ul = kel("ul", "fa-ul")

  ul.append(li)

  return ul
}

export default class SpecialOrders implements PrimarySection {
  readonly id: string = "special-orders"

  private el: HTMLElement = kel("section", "sect content special-orders", { a: { id: "data-special-orders" } })

  private players: IPlayer[]
  private farmName: string
  private quests: string[]

  constructor(data: ISaveGame) {
    this.players = data.players
    this.farmName = data.farmName
    const allQuests = data.completedSpecialOrders
    const townQuests = detail_special_orders.town

    this.quests = allQuests.filter((quest) => Object.keys(townQuests).find((townQuest) => townQuest === quest))
  }

  createElement(): void {
    const showHide = this.showHide()

    const title = kel("div", "title", { e: ['<h2><i class="fa-duotone fa-hashtag fa-fw"></i> Special Orders</h2>', showHide] })

    const field = kel("div", "field")

    const card = kel("div", "card")
    const ulRoot = kel("ul", "fa-ul")

    const infoSpecialOrders = kel("li")
    infoSpecialOrders.innerHTML = '<span class="fa-li"><i class="fa-duotone fa-light fa-newspaper"></i></span> '

    const doneNumber = this.quests.length
    const reqNumber = Object.keys(detail_special_orders.town).length

    if (this.players.length > 1) {
      infoSpecialOrders.innerHTML += `Inhabitants of <b>${this.farmName} Farm</b> has completed ${doneNumber} of ${reqNumber} town special orders`
    } else {
      const player = this.players[0]
      infoSpecialOrders.innerHTML += `<b>${player.name}</b> has completed ${doneNumber} of ${reqNumber} town special orders`
    }

    const ulCompletion = getCompletionSpecialOrders(this.quests)
    const ulCompletionParent = kel("li", null, { e: ulCompletion })

    ulRoot.append(infoSpecialOrders, ulCompletionParent)

    card.append(ulRoot)

    field.append(card)
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
    sections.specialOrders = this
    this.createElement()
    eroot().append(this.el)
  }
}
