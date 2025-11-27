import Home from "./Home"
import Farmer from "./Farmer"
import Summary from "./Summary"
import Money from "./Money"

export type ISection = {
  home: Home | null
  farmer: Farmer | null
  summary: Summary | null
  money: Money | null
}

export const sections: ISection = {
  home: null,
  farmer: null,
  summary: null,
  money: null
}
