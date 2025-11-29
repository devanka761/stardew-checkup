import detail_money from "../../json/sdvDetail/detail_money.json"
import { eroot, kel } from "../lib/kel"
import { ISaveGame } from "../types/saveFile.types"
import { PrimarySection } from "../types/section.types"
import { sections } from "./SectionManager"
import { toCommas } from "../lib/toCommas"

interface IMoney {
  name: string
  value: number
}

function createGoal(money: IMoney, earning: number): HTMLParagraphElement {
  const p = kel("p", "goal")

  const icon = kel("i")

  const name = ` ${money.name} (earn ${toCommas(money.value)}g)`

  const status = kel("span", "status")

  if (earning >= money.value) {
    p.classList.add("done")
    icon.className = "fa-duotone fa-solid fa-circle-check"
    status.innerHTML = " -- achieved"
  } else {
    icon.className = "fa-duotone fa-solid fa-circle-xmark"
    const moneyToEarn = money.value - earning
    status.innerHTML = ` -- need <span class="mono">${toCommas(moneyToEarn)}g</span> more`
  }

  p.append(icon, name, status)

  return p
}

export default class Money implements PrimarySection {
  readonly id: string = "money"
  private el: HTMLElement = kel("section", "sect money", { a: { id: "data-money" } })

  constructor(private data: ISaveGame) {}

  createElement(): void {
    const showHide = this.showHide()

    const title = kel("div", "title", { e: ['<h2><i class="fa-duotone fa-hashtag fa-fw"></i> Money</h2>', showHide] })

    const field_farm = kel("div", "field")

    const earning = this.data.players[0].totalMoneyEarned

    const infoText = `${this.data.farmName} Farm has earned <span class="mono">${toCommas(earning)}g</span>`

    const p = kel("p", "info", { e: infoText })

    const achieved = detail_money.map((money) => createGoal(money, earning))

    field_farm.append(p, ...achieved)

    this.el.append(title, field_farm)

    if (this.data.separateWallets) this.writeBreakdown()
  }

  writeBreakdown(): void {
    const field_breakdown = kel("div", "field breakdown")

    const p = kel("p", "info", { e: "Earnings Breakdown" })

    const earners = this.data.players.map((player) => {
      const earner = kel("p", "earner")
      earner.innerHTML = `<span class="mono">${toCommas(player.totalMoneyEarned)}g</span> `
      earner.append(`by ${player.name}`)
      return earner
    })

    field_breakdown.append(p, ...earners)

    this.el.append(field_breakdown)
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
    sections.money = null
  }

  init(): void {
    sections.money = this
    this.createElement()
    eroot().append(this.el)
  }
}
