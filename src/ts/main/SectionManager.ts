import Home from "./Home"
import Farmer from "./Farmer"
import Summary from "./Summary"
import Money from "./Money"
import Skills from "./Skills"
import SkillMastery from "./SkillMastery"
import Quests from "./Quests"
import SpecialOrders from "./SpecialOrders"
import MonsterHunting from "./MonsterHunting"
import Stardrops from "./Stardrops"

export type ISection = {
  home: Home | null
  farmer: Farmer | null
  summary: Summary | null
  money: Money | null
  skills: Skills | null
  skillMastery: SkillMastery | null
  quests: Quests | null
  specialOrders: SpecialOrders | null
  monsterHunting: MonsterHunting | null
  stardrops: Stardrops | null
}

export const sections: ISection = {
  home: null,
  farmer: null,
  summary: null,
  money: null,
  skills: null,
  skillMastery: null,
  quests: null,
  specialOrders: null,
  monsterHunting: null,
  stardrops: null
}
