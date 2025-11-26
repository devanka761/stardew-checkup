// import "webfont-awesome-pro/scss/allstyles.scss"
import "../sass/app.scss"
import { nav } from "./lib/nav"
import Home from "./main/Home"

nav()

window.onload = () => {
  new Home().init()
}
