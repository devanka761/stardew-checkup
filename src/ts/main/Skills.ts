import detail_skills from "../../json/sdvDetail/detail_skills.json"
import { PrimarySection } from "../types/section.types"
import { eroot, kel } from "../lib/kel"
import { sections } from "./SectionManager"
// import { toCommas } from "../lib/toCommas"
import { IPlayer } from "../types/player.types"
import { toCommas } from "../lib/toCommas"

interface ISkillPoint {
  name: string
  level: number
  exp: number
}
interface IAchieve {
  min: number
  name: string
}
interface IMaxedSkills {
  [key: string]: number
}

function getFarmerLevel(skillPoints: ISkillPoint[]): number {
  const points = skillPoints.reduce((a, b) => a + b.level, 0)

  return Math.floor(points / 2)
}

function getFarmerTitle(farmerLevel: number, gender: string): string {
  const title = detail_skills.titles.reduce((a, b) => {
    if (b.min <= farmerLevel && b.min > a.min) return b
    return a
  }, detail_skills.titles[0])

  return title.name.replace("{gender}", gender === "Male" ? "boy" : "girl")
}

function getAchieve(achive: IAchieve, level10Count: number): HTMLLIElement {
  const li = kel("li", "goal")

  const isDone = level10Count >= achive.min

  const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
  const liText = `<span class='fa-li'><i class="${icon}"></i></span> ${achive.name}`
  li.innerHTML = liText

  if (isDone) {
    li.classList.add("done")
  } else {
    const status = kel("span", "status")
    status.innerHTML = ` -- need ${achive.min - level10Count} more`
    li.append(status)
  }

  return li
}

function getReach(skill: ISkillPoint): HTMLLIElement {
  const li = kel("li", "goal")

  const isDone = skill.level >= 10

  const icon = `fa-duotone fa-solid fa-circle-${isDone ? "check" : "xmark"} fa-fw`
  const liText = `<span class='fa-li'><i class="${icon}"></i></span> ${skill.name} (level ${skill.level})`
  li.innerHTML = liText

  if (isDone) {
    li.classList.add("done")
  } else {
    const skills = detail_skills.exp_level

    const status = kel("span", "status")

    status.innerHTML = ` -- need `

    li.append(status)

    if (skill.level < 9) {
      const nextExp = skills[skill.level] - skill.exp
      status.innerHTML += `${toCommas(nextExp)} more xp to level ${skill.level + 1} and `
    }

    const maxExp = detail_skills.max_exp - skill.exp
    status.innerHTML += `${toCommas(maxExp)} more xp to level 10`
  }

  return li
}

function skillCard(player: IPlayer, skills: ISkillPoint[]): HTMLDivElement {
  const name = player.name

  const farmerLevel = getFarmerLevel(skills)
  const farmerTitle = getFarmerTitle(farmerLevel, player.gender)

  const titleText = `<span class="fa-li"><i class="fa-duotone fa-light fa-farm fa-fw"></i></span> ${name} is Farmer Level ${farmerLevel} with title ${farmerTitle}`
  const descTitle = kel("li", "skill-title", { e: titleText })

  const level10Count = skills.filter((skill) => skill.level >= 10).length

  const resultText = `<span class="fa-li"><i class="fa-duotone fa-light fa-farm fa-fw"></i></span> ${name} has reached level 10 in ${level10Count} of 5 skills`

  const descResult = kel("li", "skill-result", { e: resultText })

  const achieves = detail_skills.achieves.map((achieve) => getAchieve(achieve, level10Count))

  const achieveCard = kel("ul", "fa-ul", { e: achieves })

  const reaches = skills.filter((skill) => skill.name).map((skill) => getReach(skill))
  const reachedCard = kel("ul", "fa-ul", { e: reaches })

  achieveCard.append(reachedCard)

  const ul = kel("ul", "fa-ul", { e: [descTitle, descResult, achieveCard] })

  const card = kel("div", "card", { e: ul, a: { id: `data-skills-${player.umid}` } })
  return card
}

export default class Skills implements PrimarySection {
  readonly id: string = "skills"

  private el: HTMLElement = kel("section", "sect skills", { a: { id: "data-skills" } })

  private skillsMaxed: IMaxedSkills = {}

  private btnShowHide?: HTMLDivElement

  constructor(private data: IPlayer[]) {}

  createElement(): void {
    this.btnShowHide = this.showHide()

    const title = kel("div", "title", { e: ['<h2><i class="fa-duotone fa-hashtag fa-fw"></i> Skills</h2>', this.btnShowHide] })

    const field = kel("div", "field")

    this.data.forEach((player) => {
      const skills: ISkillPoint[] = player.experiencePoints.map((exp, i) => {
        const levels = detail_skills.exp_level

        let levelIndex = levels.findIndex((lv) => exp < lv)
        if (levelIndex <= -1) levelIndex = levels.length

        return {
          name: detail_skills.skills[i],
          level: levelIndex,
          exp
        }
      })

      this.skillsMaxed[player.umid] = skills.filter((skill) => skill.level >= 10).length

      field.append(skillCard(player, skills))
    })

    this.el.append(title, field)
  }

  forceShow(): void {
    if (this.el.classList.contains("hide") && this.btnShowHide) {
      this.btnShowHide.click()
    }
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

  getMaxedSkills(multiplayerId: string): number {
    return this.skillsMaxed[multiplayerId]
  }

  destroy(): void {
    this.el.remove()
    sections.skills = null
  }

  init(): void {
    sections.skills = this
    this.createElement()
    eroot().append(this.el)
  }
}
