import Home from "./Home"
import Farmer from "./Farmer"
import Summary from "./Summary"
import Money from "./Money"
import Skills from "./Skills"

export type ISection = {
  home: Home | null
  farmer: Farmer | null
  summary: Summary | null
  money: Money | null
  skills: Skills | null
}

export const sections: ISection = {
  home: null,
  farmer: null,
  summary: null,
  money: null,
  skills: null
}
