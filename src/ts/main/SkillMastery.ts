import detail_skill_mastery from "../../json/sdvDetail/detail_skill_mastery.json"
import { PrimarySection } from "../types/section.types"
import { eroot, futor, kel } from "../lib/kel"
import { sections } from "./SectionManager"
import { IPlayer } from "../types/player.types"
import { toCommas } from "../lib/toCommas"
import { toAnchor } from "../lib/toAnchor"

interface IMasteryXpCount {
  next: number
  max: number
  last: boolean
}

function getMasteryCave(player: IPlayer, maxCount: number): HTMLLIElement {
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

    const anchor = toAnchor(`#Skills/${player.name}`, `data-skills-${player.umid}`, {
      scroll: true,
      asText: true
    })

    status.innerHTML = ` -- ${anchor} - need ${detail_skill_mastery.skills.length - maxCount} more maxed skill`

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

function getInfoMaxedSkills(player: IPlayer, maxCount: number): HTMLLIElement {
  const reqMax = detail_skill_mastery.skills.length

  const li = kel("li")
  li.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-candle-holder"></i></span> <b>${player.name}</b> has maxed ${maxCount} of ${reqMax} skills`

  const ulAchieves = kel("ul", "fa-ul")

  const infoMasteryCave = getMasteryCave(player, maxCount)

  ulAchieves.append(infoMasteryCave)

  li.append(ulAchieves)

  return li
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

function getMastery100K(xp: number): HTMLLIElement {
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
function getInfoMasteryXP(player: IPlayer): HTMLLIElement {
  const li = kel("li")
  li.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-candle-holder"></i></span> <b>${player.name}</b> has ${toCommas(player.masteryExp)} mastery xp`

  const ulAchieves = kel("ul", "fa-ul")

  const infoMastery100K = getMastery100K(player.masteryExp)

  ulAchieves.append(infoMastery100K)

  li.append(ulAchieves)

  return li
}

function getPerksAcquired(perks: string[]): HTMLLIElement[] {
  const masteryPerks: HTMLLIElement[] = detail_skill_mastery.skills.map((skill, i) => {
    const li = kel("li", "goal")

    const isDone = perks.some((perk) => perk === `mastery_${i}`)

    const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`

    const anchor = toAnchor(`${skill} Mastery`, "https://stardewvalleywiki.com/Mastery_Cave#Masteries", {
      asText: true,
      blank: true,
      className: "cc"
    })

    const liText = `<span class='fa-li'><i class="${icon}"></i></span> ${anchor}`
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

  return masteryPerks
}

function getAchievePerks(perks: string[]): HTMLLIElement {
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

  const ulPerks = kel("ul", "fa-ul")

  const infoPerksAcquired = getPerksAcquired(perks)

  ulPerks.append(...infoPerksAcquired)

  li.append(ulPerks)

  return li
}

function getInfoMasteryPerks(player: IPlayer): HTMLLIElement {
  const reqMax = detail_skill_mastery.skills.length
  const perks = player.masteryPerks

  const li = kel("li")
  li.innerHTML = `<span class="fa-li"><i class="fa-duotone fa-light fa-candle-holder"></i></span> <b>${player.name}</b> has selected ${perks.length} of ${reqMax} mastery perks`

  const ulAchieves = kel("ul", "fa-ul")

  const infoAchieve = getAchievePerks(perks)

  ulAchieves.append(infoAchieve)

  li.append(ulAchieves)

  return li
}

export default class SkillMastery implements PrimarySection {
  readonly id: string = "skillmastery"

  private el: HTMLElement = kel("section", "sect content skill-mastery", { a: { id: "data-skill-mastery" } })

  constructor(private data: IPlayer[]) {}

  createElement(): void {
    const showHide = this.showHide()

    const title = kel("div", "title", { e: ['<h2><i class="fa-duotone fa-hashtag fa-fw"></i> Skill Mastery</h2>', showHide] })

    const field = kel("div", "field")

    this.data.forEach((player) => {
      const card = kel("div", "card")

      const ulRoot = kel("ul", "fa-ul")

      const maxCount = sections.skills?.getMaxedSkills(player.umid) || 0

      const infoMaxedSkill = getInfoMaxedSkills(player, maxCount)

      const infoMasteryXp = getInfoMasteryXP(player)

      const infoMasteryPerks = getInfoMasteryPerks(player)

      ulRoot.append(infoMaxedSkill, infoMasteryXp, infoMasteryPerks)

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
