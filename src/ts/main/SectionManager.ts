import Farmer from "./Farmer"
import Home from "./Home"

export type ISection = {
  farmer: Farmer | null
  home: Home | null
}

export const sections: ISection = {
  farmer: null,
  home: null
}
