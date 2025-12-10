import detail_quests from "../../json/sdvDetail/detail_quests.json"
import { PrimarySection } from "../types/section.types"
import { eroot, kel } from "../lib/kel"
import { sections } from "./SectionManager"
import { IPlayer } from "../types/player.types"
import { toCommas } from "../lib/toCommas"

interface IQuest {
  id: string
  name: string
  min: number
}

function getQuestsCompletion(questCompleted: number): HTMLUListElement {
  const n = questCompleted

  const quests: IQuest[] = detail_quests

  const completionList: HTMLLIElement[] = quests.map((quest) => {
    const isDone = questCompleted >= quest.min

    const li = kel("li", "goal")

    const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
    const liText = `<span class='fa-li'><i class="${icon}"></i></span> ${quest.name}`
    li.innerHTML = liText

    const status = kel("span", "status")
    li.append(status)

    if (isDone) {
      li.classList.add("done")
      status.innerHTML = ` achieved`
    } else {
      status.innerHTML = ` -- need ${quest.min - n} more`
    }
    return li
  })

  const ul = kel("ul", "fa-ul")

  ul.append(...completionList)

  return ul
}

export default class Quests implements PrimarySection {
  readonly id: string = "quests"

  private el: HTMLElement = kel("section", "sect content quests", { a: { id: "data-quests" } })

  constructor(private data: IPlayer[]) {}

  createElement(): void {
    const showHide = this.showHide()

    const title = kel("div", "title", { e: ['<h2><i class="fa-duotone fa-hashtag fa-fw"></i> Quests</h2>', showHide] })

    const field = kel("div", "field")

    this.data.forEach((player) => {
      const card = kel("div", "card")

      const ulRoot = kel("ul", "fa-ul")

      const infoQuests = kel("li")
      infoQuests.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-newspaper"></i></span> <b>${player.name}</b> has completed ${toCommas(player.questsCompleted)} "Help Wanted" quest(s)`

      const ulCompletion = getQuestsCompletion(player.questsCompleted)
      const ulCompletionParent = kel("li", null, { e: ulCompletion })

      ulRoot.append(infoQuests, ulCompletionParent)

      card.append(ulRoot)

      field.append(card)
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
    sections.quests = this
    this.createElement()
    eroot().append(this.el)
  }
}
