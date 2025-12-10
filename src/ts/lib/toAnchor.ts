import { kel } from "../lib/kel"

interface IAnchorOptions {
  blank?: boolean
  scroll?: boolean
  samePage?: boolean
  asText?: boolean
  className?: string
}

function toAnchorText(text: string, destination: string, options: IAnchorOptions = {}): string {
  const samePage = options.samePage || options.scroll
  let attribute = `href="${samePage ? "#" : ""}${destination}"`
  if (options.blank) attribute += ' target="_blank"'
  if (options.scroll) attribute += ' scroll="1"'
  if (options.className) attribute += ` class="${options.className}"`

  const a = `<a ${attribute}>${text}</a>`
  return a
}

export function toAnchor(text: string, destination: string, options: IAnchorOptions = {}): HTMLAnchorElement | string {
  if (options.asText) return toAnchorText(text, destination, options)

  const a = kel("a")
  a.innerHTML = text

  if (options.blank) a.target = "_blank"
  if (options.scroll) a.setAttribute("scroll", "1")
  if (options.className) a.className = options.className

  const samePage = options.samePage || options.scroll
  a.href = `${samePage ? "#" : ""}${destination}`

  return a as HTMLAnchorElement
}
