import detail_skill_mastery from "../../json/sdvDetail/detail_skill_mastery.json"
import { PrimarySection } from "../types/section.types"
import { eroot, futor, kel } from "../lib/kel"
import { sections } from "./SectionManager"
import { IPlayer } from "../types/player.types"
import { toCommas } from "../lib/toCommas"

function getMaxedSkills(player: IPlayer, maxCount: number): HTMLLIElement {
  const li = kel("li", "goal")

  const achieveString = "Gain access to the Mastery Cave"

  const isDone = maxCount >= 5

  const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
  const liText = `<span class='fa-li'><i class="${icon}"></i></span> ${achieveString}`
  li.innerHTML = liText

  if (isDone) {
    li.classList.add("done")
  } else {
    const status = kel("span", "status")
    li.append(status)

    status.innerHTML = ` -- need ${detail_skill_mastery.skills.length - maxCount} more maxed skill <a href="#data-skills-${player.umid}" scroll="1">#Skills/${player.name}</a>`

    const a = futor("a", status) as HTMLAnchorElement
    a.onclick = (e) => {
      e.preventDefault()
      if (sections.skills) {
        sections.skills.forceShow()
        const rawCardId = a.getAttribute("href")!
        const cardId = rawCardId.replace("#", "")

        const skillCard = document.getElementById(cardId)!
        skillCard.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
      }
    }
  }

  return li
}

interface IMasteryXpCount {
  next: number
  max: number
  last: boolean
}

function masteryXpCount(xp: number): IMasteryXpCount {
  const levels = detail_skill_mastery.exp_level
  const nextIndex = levels.findIndex((level) => xp < level)

  const nextCount = nextIndex > -1 ? nextIndex : 0

  return {
    next: levels[nextCount] - xp,
    max: levels[levels.length - 1] - xp,
    last: nextCount === levels.length - 1
  }
}

function getMasteryXp(xp: number): HTMLLIElement {
  const li = kel("li", "goal")

  const achieveString = "Reach 100,000 mastery xp"

  const isDone = xp >= 100000

  const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
  const liText = `<span class='fa-li'><i class="${icon}"></i></span> ${achieveString}`
  li.innerHTML = liText

  if (isDone) {
    li.classList.add("done")
  } else {
    const status = kel("span", "status")
    li.append(status)

    status.innerHTML = ` -- need `

    const nextMasteryXp = masteryXpCount(xp)

    if (!nextMasteryXp.last) {
      status.innerHTML += `${toCommas(nextMasteryXp.next)} more xp for next perk unlock and `
    }

    status.innerHTML += `${toCommas(nextMasteryXp.max)} more xp overall`
  }

  return li
}

function getMasteryPerks(perks: string[]): HTMLLIElement {
  const li = kel("li", "goal")

  const achieveString = "Acquire all mastery perks"

  const skills = detail_skill_mastery.skills

  const isDone = perks.length === skills.length

  const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
  const liText = `<span class='fa-li'><i class="${icon}"></i></span> ${achieveString}`
  li.innerHTML = liText

  if (isDone) {
    li.classList.add("done")
  } else {
    const status = kel("span", "status")
    li.append(status)

    status.innerHTML = ` -- need ${skills.length - perks.length} more`
  }

  return li
}

function getAcquirePerks(perks: string[]): HTMLUListElement {
  const ul = kel("ul", "fa-ul")

  const skills: HTMLLIElement[] = detail_skill_mastery.skills.map((skill, i) => {
    const li = kel("li", "goal")

    const isDone = perks.some((perk) => perk === `mastery_${i}`)

    const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
    const liText = `<span class='fa-li'><i class="${icon}"></i></span> ${skill}`
    li.innerHTML = liText

    if (isDone) {
      li.classList.add("done")
    } else {
      const status = kel("span", "status")
      li.append(status)

      status.innerHTML = ` -- not acquired`
    }

    return li
  })

  ul.append(...skills)

  return ul
}

export default class SkillMastery implements PrimarySection {
  readonly id: string = "skillmastery"

  private el: HTMLElement = kel("section", "sect skill-mastery", { a: { id: "data-skill-mastery" } })

  constructor(private data: IPlayer[]) {}

  createElement(): void {
    const showHide = this.showHide()

    const title = kel("div", "title", { e: ['<h2><i class="fa-duotone fa-hashtag fa-fw"></i> Skill Mastery</h2>', showHide] })

    const field = kel("div", "field")

    this.data.forEach((player) => {
      const card = kel("div", "card")

      const ulRoot = kel("ul", "fa-ul")

      const countMaxSkills = sections.skills?.getMaxedSkills(player.umid) || 0

      const infoMaxedSkill = kel("li")
      infoMaxedSkill.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-candle-holder"></i></span> ${player.name} has maxed ${countMaxSkills} of ${detail_skill_mastery.skills.length} skills`

      const ulMaxedSkill = kel("ul", "fa-ul")

      const liMaxedSkill = getMaxedSkills(player, countMaxSkills)
      ulMaxedSkill.append(liMaxedSkill)

      const infoMasteryXp = kel("li")
      infoMasteryXp.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-candle-holder"></i></span> ${player.name} has ${toCommas(player.masteryExp)} mastery xp`

      const ulMasteryXp = kel("ul", "fa-ul")

      const liMasteryXp = getMasteryXp(player.masteryExp)

      ulMasteryXp.append(liMasteryXp)

      const infoMasteryPerks = kel("li")
      infoMasteryPerks.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-candle-holder"></i></span> ${player.name} has selected ${player.masteryPerks.length} of ${detail_skill_mastery.skills.length} mastery perks`

      const ulMasteryPerks = kel("ul", "fa-ul")

      const liMasteryPerks = getMasteryPerks(player.masteryPerks)

      const ulAcquirePerks = getAcquirePerks(player.masteryPerks)

      ulMasteryPerks.append(liMasteryPerks, ulAcquirePerks)

      ulRoot.append(infoMaxedSkill, ulMaxedSkill, infoMasteryXp, ulMasteryXp, infoMasteryPerks, ulMasteryPerks)

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
    sections.skillMastery = this
    this.createElement()
    eroot().append(this.el)
  }
}
