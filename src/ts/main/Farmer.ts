import { eroot, kel } from "../lib/kel"
import { playerCard } from "../lib/playerCard"
import { IPlayer } from "../types/player.types"
import { PrimarySection } from "../types/section.types"
import { sections } from "./SectionManager"

export default class Farmer implements PrimarySection {
  readonly id: string = "farmer"
  private el: HTMLElement = kel("section", "sect farmer", { a: { id: "data-farmer" } })

  private host: HTMLDivElement = kel("div", "farmer-board farmer-host")
  private farmhands: HTMLDivElement = kel("div", "farmer-board farmer-farmhands")

  constructor(private players: IPlayer[]) {}

  private createHost(): void {
    const showHide = this.showHide(this.host)

    const title = kel("div", "title", { e: ['<h2><i class="fa-duotone fa-hashtag fa-fw"></i> Farmer</h2>', showHide] })
    const field = kel("div", "field")

    const farmer = playerCard(this.players[0], 1)
    field.append(farmer)

    this.host.append(title, field)
    this.el.append(this.host)
  }

  private createFarmHands(): void {
    const farmhands = this.players.filter((player) => !player.isHost)
    if (farmhands.length < 1) return

    const showHide = this.showHide(this.farmhands)

    const title = kel("div", "title", { e: ["<h2>Farmhands</h2>", showHide] })
    const field = kel("div", "field")

    farmhands.forEach((player, i) => {
      const farmer = playerCard(player, i + 2)
      field.append(farmer)
    })

    this.farmhands.append(title, field)
    this.el.append(this.host, this.farmhands)
  }

  showHide(element: HTMLElement): HTMLDivElement {
    const btnShowHide = kel("div", "show-hide")
    btnShowHide.innerHTML = `Hide Detail <i class="fa-solid fa-chevron-down"></i>`

    btnShowHide.onclick = () => {
      if (element.classList.contains("hide")) {
        btnShowHide.innerHTML = `Hide Detail <i class="fa-solid fa-chevron-down"></i>`
        element.classList.remove("hide")
      } else {
        btnShowHide.innerHTML = `Show Detail <i class="fa-solid fa-chevron-right"></i>`
        element.classList.add("hide")
      }
    }

    return btnShowHide
  }

  destroy(): void {
    this.el.remove()
    sections.farmer = null
  }

  init(): void {
    sections.farmer = this
    eroot().append(this.el)
    this.createHost()
    this.createFarmHands()
  }
}
