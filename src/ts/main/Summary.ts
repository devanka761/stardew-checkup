import { eroot, kel } from "../lib/kel"
import sdate from "../lib/sdate"
import { ISaveGame } from "../types/saveFile.types"
import { PrimarySection } from "../types/section.types"
import { sections } from "./SectionManager"

export default class Summary implements PrimarySection {
  readonly id: string = "summary"
  private el: HTMLElement = kel("section", "sect summary", { a: { id: "data-summary" } })

  constructor(private data: ISaveGame) {}

  createElement(): void {
    const showHide = this.showHide()
    const title = kel("div", "title", { e: ['<h2><i class="fa-duotone fa-hashtag fa-fw"></i> Summary</h2>', showHide] })

    const field = kel("div", "field")

    const farmId = `${this.data.farmName} Farm`
    const farmType = this.data.whichFarm
    const farmName = `<b>${farmId}</b> (${farmType})`

    const season = this.data.currentSeason
    const seasonText = season.charAt(0).toUpperCase() + season.slice(1)

    const ingameDate = `Day ${this.data.dayOfMonth} of ${seasonText}, Year ${this.data.year}`

    const gameVersion = `Version ${this.data.gameVersion}`

    const playTime = `Played for <span class="mono">${sdate.durrTime(this.data.players[0].playTime)}</span>`

    field.append(kel("p", null, { e: farmName }), kel("p", null, { e: ingameDate }), kel("p", null, { e: playTime }), kel("p", null, { e: gameVersion }))

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
    sections.summary = null
  }

  init(): void {
    sections.summary = this
    this.createElement()
    eroot().append(this.el)
  }
}
