import { JSONStore } from "../lib/jsonStorage"
import { eroot, futor, kel } from "../lib/kel"
import modal from "../lib/modal"
import { showNav, updateScrollable } from "../lib/nav"
import { readSaveFile } from "../lib/readXml"
import { ISaveGame } from "../types/saveFile.types"
import { PrimarySection } from "../types/section.types"
import Farmer from "./Farmer"
import Money from "./Money"
import { sections } from "./SectionManager"
import Summary from "./Summary"
import { isValidGameVersion, minVersion } from "../parser/gameVersion"
import Skills from "./Skills"
import SkillMastery from "./SkillMastery"
import Quests from "./Quests"
import SpecialOrders from "./SpecialOrders"

export default class Home implements PrimarySection {
  readonly id: string = "home"

  private el: HTMLElement = kel("section", "home")
  private form!: HTMLFormElement
  private note?: HTMLDivElement
  private navigation?: HTMLDivElement
  private lastFileName: string = "No File Selected"

  private createElement(): void {
    const title = this.createTitle()
    const form = this.createForm()
    this.note = this.createNote()

    this.el.append(title, form, this.note)
  }

  private createTitle(): HTMLDivElement {
    return kel("div", "title", { e: `<h1>Stardew Valley Checkup 2</h1>` })
  }

  private createForm(): HTMLFormElement {
    this.form = kel("form", "form", { a: { id: "form", action: "/x/local-read" } })
    this.form.innerHTML = `
    <label for="save-file">Select a save file to check:</label>
    <input type="file" name="save-file" id="save-file" />
    <p class="save-file-name has-file">No File Selected</p>
    <button class="btn btn-input"><i class="fa-duotone fa-light fa-floppy-disk"></i> Choose File</button>`

    const saveFileName = futor(".save-file-name", this.form) as HTMLParagraphElement

    const input = futor("input", this.form) as HTMLInputElement
    input.onchange = async () => {
      saveFileName.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> LOADING'
      if (!input.files || input.files.length < 1) {
        saveFileName.innerHTML = this.lastFileName
        return
      }

      const file = input.files[0]
      const SaveFile = readSaveFile(await file.text())

      if (!SaveFile.ok || !SaveFile.data) {
        await modal.abort()
        await modal.alert("SAVE FILE IS INVALID!")
        saveFileName.innerHTML = this.lastFileName
        return
      }

      const saveData = SaveFile.data

      if (!isValidGameVersion(saveData.gameVersion)) {
        await modal.abort()
        await modal.alert(`The minimum game version required is <b>${minVersion}</b><br/>Your game version in the save file is <b>v${saveData.gameVersion}</b>`)
        saveFileName.innerHTML = this.lastFileName
        return
      }

      const fileName = file.name
      this.lastFileName = fileName

      this.renderData(saveData, fileName)

      const dbStore = new JSONStore("Devanka", "StardewCheckup2")

      const allKeys = await dbStore.getAll()

      if (allKeys && allKeys.length >= 1) {
        for (const key of allKeys) {
          await dbStore.delete(key)
        }
      }

      await dbStore.save({
        id: fileName,
        data: saveData
      })
    }

    this.form.onsubmit = (e) => {
      e.preventDefault()
      input.click()
    }

    return this.form
  }

  private renderData(saveData: ISaveGame, fileName: string): void {
    this.note?.remove()
    this.navigation?.remove()

    this.navigation = this.createNavigation()
    this.el.append(this.navigation)

    showNav()
    updateScrollable()

    const saveFileName = futor(".save-file-name", this.form) as HTMLParagraphElement
    saveFileName.innerText = fileName
    this.lastFileName = fileName

    const primarySections = Object.values(sections).filter((itm) => itm && itm.id !== "home")

    primarySections.forEach((itm) => {
      if (itm) itm.destroy()
    })

    new Summary(saveData).init()
    new Farmer(saveData.players).init()
    new Money(saveData).init()
    new Skills(saveData.players).init()
    new SkillMastery(saveData.players).init()
    new Quests(saveData.players).init()
    new SpecialOrders(saveData).init()
  }

  private createNote(): HTMLDivElement {
    const quickNote = kel("div", "quick-note")
    quickNote.innerHTML = `
    <p class="jstf">Please use the full save file named with your farmer's name (or farm name) and an ID number (e.g. <span class="mono">Luna_148093307</span>). Do not use the <span class="mono red">SaveGameInfo</span> file as it does not contain all the necessary information.</p>
    <p>Default save file locations are:</p>

    <ul class="fa-ul">
      <li>
        <span class="fa-li"> <i class="fa-duotone fa-light fa-hand-point-right"></i> </span>Windows: <span class="mono perletter">%AppData%\\StardewValley\\Saves\\</span>
      </li>
      <li>
        <span class="fa-li"> <i class="fa-duotone fa-light fa-hand-point-right"></i> </span>Mac OSX & Linux: <span class="mono perletter">~/.config/StardewValley/Saves/</span>
      </li>
      <li>
        <span class="fa-li"> <i class="fa-duotone fa-light fa-hand-point-right"></i> </span>Proton Steam (Ubuntu): <span class="mono perletter">~/.steam/debian-installation/steamapps/compatdata/413150/pfx/drive_c/users/steamuser/AppData/Roaming/StardewValley/Saves/</span>
      </li>
    </ul>`
    return quickNote
  }

  private createNavigation(): HTMLDivElement {
    const quickNav = kel("div", "quick-nav")
    quickNav.innerHTML = `
    <h3>Quick Navigation</h3>
    <div class="quick-actions">
      <a scroll="1" href="#data-summary">Summary</a>
      <a scroll="1" href="#data-farmer">Farmer</a>
      <a scroll="1" href="#data-perfection-tracker" class="golden">Perfection Tracker</a>
      <a scroll="1" href="#data-money">Money</a>
      <a scroll="1" href="#data-skills" class="golden">Skills</a>
      <a scroll="1" href="#data-skill-mastery">Skill Mastery</a>
      <a scroll="1" href="#data-quests">Quests</a>
      <a scroll="1" href="#data-special-orders">Special Orders</a>
      <a scroll="1" href="#data-monster-hunting" class="golden">Monster Hunting</a>
      <a scroll="1" href="#data-stardrops" class="golden">Stardrops</a>
      <a scroll="1" href="#data-home-family">Home and Family</a>
      <a scroll="1" href="#data-social" class="golden">Social</a>
      <a scroll="1" href="#data-cooking" class="golden">Cooking</a>
      <a scroll="1" href="#data-crafting" class="golden">Crafting</a>
      <a scroll="1" href="#data-fishing" class="golden">Fishing</a>
      <a scroll="1" href="#data-basic-shipping" class="golden">Basic Shipping</a>
      <a scroll="1" href="#data-crop-shipping">Crop Shipping</a>
      <a scroll="1" href="#data-books-items-powers">Book, Special Items, and Powers</a>
      <a scroll="1" href="#data-museum-collection">Museum Collection</a>
      <a scroll="1" href="#data-secret-notes">Secret Notes</a>
      <a scroll="1" href="#data-journal-scraps">Journal Scraps</a>
      <a scroll="1" href="#data-community-center">Community Center / Joja Community Development</a>
      <a scroll="1" href="#data-forest-neighbors">Forest Neighbors</a>
      <a scroll="1" href="#data-granpas-evaluation">Grandpa's Evaluation</a>
      <a scroll="1" href="#data-golden-walnuts" class="golden">Golden Walnuts</a>
      <a scroll="1" href="#data-island-upgrades">Island Upgrades</a>
      <a scroll="1" href="#data-arcade-games">Arcade Games</a>
      <a scroll="1" href="#data-animal-summary">Animal Summary</a>
    </div>`
    return quickNav
  }

  private async loadIfAvailable(): Promise<void> {
    const dbStore = new JSONStore("Devanka", "StardewCheckup2")

    const allKeys = await dbStore.getAll()

    if (!allKeys || allKeys.length < 1) return

    const fileName = allKeys[0]

    const saveData = await dbStore.load(fileName)

    if (!saveData || !saveData.data) return

    this.renderData(saveData.data, fileName)
  }

  destroy(): void {
    this.el.remove()
    sections.home = null
  }

  setParallax(): void {
    window.addEventListener("scroll", () => {
      const scrollHeight = window.scrollY
      const paralaxTop = this.el.offsetTop

      const clientHeight = paralaxTop + this.el.offsetHeight
      const clientTop = paralaxTop - window.innerHeight
      const offset = scrollHeight - paralaxTop

      if (scrollHeight >= clientTop && scrollHeight < clientHeight) {
        this.el.style.backgroundPositionY = offset * 0.6 + "px"
      }
    })
  }

  init(): void {
    sections.home = this
    this.createElement()
    eroot().append(this.el)
    this.loadIfAvailable()
    this.setParallax()
  }
}
