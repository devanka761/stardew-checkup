import { eroot, kel } from "../lib/kel"
import { playerCard } from "../lib/playerCard"
import { IPlayer } from "../types/player.types"
import { sections } from "./SectionManager"

export default class Farmer {
  private el: HTMLElement = kel("section", "farmer", { a: { id: "data-farmer" } })

  private host: HTMLDivElement = kel("div", "farmer-board farmer-host")
  private farmhands: HTMLDivElement = kel("div", "farmer-board farmer-farmhands")

  constructor(private players: IPlayer[]) {}

  private createHost(): void {
    const title = kel("div", "title", { e: `<h2>Farmer</h2>` })
    const field = kel("div", "field")

    const farmer = playerCard(this.players[0], 1)
    field.append(farmer)

    this.host.append(title, field)
    this.el.append(this.host)
  }

  private createFarmHands(): void {
    const farmhands = this.players.filter((player) => !player.isHost)
    if (farmhands.length < 1) return

    const title = kel("div", "title", { e: `<h2>Farmhands</h2>` })
    const field = kel("div", "field")

    farmhands.forEach((player, i) => {
      const farmer = playerCard(player, i + 2)
      field.append(farmer)
    })

    this.farmhands.append(title, field)
    this.el.append(this.host, this.farmhands)
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
