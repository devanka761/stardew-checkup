import { IPlayer } from "./player.types"

export interface IEyeColorInSkin {
  R: number
  G: number
  B: number
  A: number
}

export interface IEyeInSkin {
  gender: 0 | 1
  eyeColor: IEyeColorInSkin
}

export interface IInSkin {
  body: number
  eyes: IEyeInSkin
  pant?: { itemId: string | number; clothesColor: { R: number; G: number; B: number; A: number } }
  shirt?: { itemId: string | number; clothesColor: { R: number; G: number; B: number; A: number } }
  accessory?: number
  hair: number
  hat?: { itemId: string | number; hairDrawType: string | number }
  arm: number
}

export interface IPlayerSprites {
  [key: string]: {
    img: IRenderData[]
    length: number
  }
}

export interface IGetCtx {
  body: (itm: string, sk: IInSkin["body"], player: IPlayer, ctx: CanvasRenderingContext2D) => void
  eyes: (itm: string, sk: IInSkin["eyes"], player: IPlayer, ctx: CanvasRenderingContext2D) => void
  pant: (itm: string, sk: IInSkin["pant"], player: IPlayer, ctx: CanvasRenderingContext2D) => void
  shirt: (itm: string, sk: IInSkin["shirt"], player: IPlayer, ctx: CanvasRenderingContext2D) => void
  accessory: (itm: string, sk: IInSkin["accessory"], player: IPlayer, ctx: CanvasRenderingContext2D) => void
  hair: (itm: string, sk: IInSkin["hair"], player: IPlayer, ctx: CanvasRenderingContext2D) => void
  hat: (itm: string, sk: IInSkin["hat"], player: IPlayer, ctx: CanvasRenderingContext2D) => void
  arm: (itm: string, sk: IInSkin["arm"], player: IPlayer, ctx: CanvasRenderingContext2D) => void
}

export interface IRenderData {
  idx: number
  img: HTMLImageElement | OffscreenCanvas
  sx: number
  sy: number
  swidth: number
  sheight: number
  dx: number
  dy: number
  dwidth: number
  dheight: number
}
