export type SSKelement = HTMLElementTagNameMap[keyof HTMLElementTagNameMap]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ISival = any

export type IReqType = "POST" | "GET"

export interface ILocale {
  id: string
  en: string
}

export interface KelementAttr {
  c?: string
  class?: string
  "."?: string
  id?: string
  "#"?: string
  a?: {
    [key: string]: string | number | boolean
  }
  attr?: {
    [key: string]: string | number | boolean
  }
  child?: SSKelement | string | (SSKelement | string)[]
  e?: SSKelement | string | (SSKelement | string)[]
}
export interface ILocale {
  id: string
  en: string
}
