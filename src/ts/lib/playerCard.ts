import dim from "../../json/sdvData/gen_dimentions.json"
import data_shirts from "../../json/sdvData/data_shirts.json"
import data_pants from "../../json/sdvData/data_pants.json"
import data_hats from "../../json/sdvData/data_hats.json"
import data_skins from "../../json/sdvData/data_skins.json"
import data_hairs from "../../json/sdvData/data_hairs.json"

import { IPlayer } from "../types/player.types"
import { IEyeColorInSkin, IGetCtx, IInSkin, IPlayerSprites, IRenderData } from "../types/playerCard.types"
import { futor } from "./kel"
import sdate from "./sdate"

const _sprites: IPlayerSprites = {}

const time_pixel = 1

const coorOffset = { x: 20, y: 2 }

function getSheetXY(sheet_id: number, dim_key: string, keyID: number = 0) {
  const parseX = dim[dim_key as keyof typeof dim].x * time_pixel
  const parseY = dim[dim_key as keyof typeof dim].y * time_pixel

  if (sheet_id < 0) return { x: -32, y: -32 }

  const sheetWidth = parseX * dim[dim_key as keyof typeof dim].ox
  // @ts-expect-error no default types
  const getKeyID = typeof dim[dim_key as keyof typeof dim].oy === "number" ? dim[dim_key as keyof typeof dim].oy : dim[dim_key as keyof typeof dim].oy[keyID]
  const shirtHeight = parseY * getKeyID
  const shirtsPerRow = dim[dim_key as keyof typeof dim].z

  const x = (sheet_id % shirtsPerRow) * sheetWidth
  const y = Math.floor(sheet_id / shirtsPerRow) * shirtHeight

  return { x, y }
}

function colorizeDyeAble(img: HTMLImageElement, sheetData: Partial<IRenderData>, dyeColor: IEyeColorInSkin) {
  const offscreen = new OffscreenCanvas(sheetData.swidth!, sheetData.sheight!)
  const ctx = offscreen.getContext("2d")!

  ctx.drawImage(img, sheetData.sx!, sheetData.sy!, sheetData.swidth!, sheetData.sheight!, sheetData.dx!, sheetData.dy!, sheetData.dwidth!, sheetData.dheight!)

  const imageData = ctx.getImageData(0, 0, sheetData.swidth!, sheetData.sheight!)

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] *= dyeColor.R
    imageData.data[i + 1] *= dyeColor.G
    imageData.data[i + 2] *= dyeColor.B
    imageData.data[i + 3] *= dyeColor.A
  }

  ctx.putImageData(imageData, 0, 0)

  return offscreen
}

function renderPlayerSprite(playerName: string, ctx: CanvasRenderingContext2D) {
  if (_sprites[playerName].length < 13) return
  _sprites[playerName].img
    .sort((a, b) => {
      if (a.idx > b.idx) return 1
      if (a.idx < b.idx) return -1
      return 0
    })
    .forEach((snap) => {
      ctx.drawImage(snap.img, snap.sx, snap.sy, snap.swidth, snap.sheight, snap.dx, snap.dy, snap.dwidth, snap.dheight)
    })
}

const getCtx: IGetCtx = {
  body(itm, sk, player, ctx) {
    const hasHair = player.sprite.hair !== 52 && player.sprite.hair >= 0
    const sheet_id = sk + (hasHair ? 0 : 2)
    const sheet_offset = getSheetXY(sheet_id, itm)
    const img = new Image()
    img.onload = () => {
      for (let i = 0; i < 3; i++) {
        const sheetData = {
          sx: sheet_offset.x + i * 16,
          sy: sheet_offset.y,
          swidth: dim[itm as keyof typeof dim].x,
          sheight: dim[itm as keyof typeof dim].y,
          dx: 0,
          dy: 0,
          dwidth: dim[itm as keyof typeof dim].x,
          dheight: dim[itm as keyof typeof dim].y
        }
        const attrColor = data_skins[i][player.sprite.skin]
        const skinColor = {
          R: (attrColor.R || 0) / 255,
          G: (attrColor.G || 0) / 255,
          B: (attrColor.B || 0) / 255,
          A: (attrColor.A || 0) / 255
        }
        const colorizedImage = colorizeDyeAble(img, sheetData, skinColor)

        const renderData = {
          idx: dim[itm as keyof typeof dim].idx,
          img: colorizedImage,
          sx: 0,
          sy: 0,
          swidth: dim[itm as keyof typeof dim].x,
          sheight: dim[itm as keyof typeof dim].y,
          dx: (coorOffset.x - dim[itm as keyof typeof dim].x) / 2,
          dy: 0 + coorOffset.y,
          dwidth: dim[itm as keyof typeof dim].x,
          dheight: dim[itm as keyof typeof dim].y
        }
        _sprites[player.name].img.push(renderData)
        _sprites[player.name].length++
        renderPlayerSprite(player.name, ctx)
      }
    }
    img.src = `./assets/sdv/farmer/${dim[itm as keyof typeof dim].file}.png`
  },
  eyes(itm, sk, player, ctx) {
    const sheet_id = sk.gender
    const sheet_offset = getSheetXY(sheet_id, itm)
    const img = new Image()
    img.onload = () => {
      for (let i = 0; i < 2; i++) {
        const sheetData = {
          sx: sheet_offset.x + i * 16,
          sy: sheet_offset.y,
          swidth: dim[itm as keyof typeof dim].x,
          sheight: dim[itm as keyof typeof dim].y,
          dx: 0,
          dy: 0,
          dwidth: dim[itm as keyof typeof dim].x,
          dheight: dim[itm as keyof typeof dim].y
        }
        let colorizedImage = null
        if (i === 1) {
          const attrColor = sk.eyeColor
          const eyeColor = {
            R: (attrColor.R || 0) / 255,
            G: (attrColor.G || 0) / 255,
            B: (attrColor.B || 0) / 255,
            A: (attrColor.A || 0) / 255
          }
          colorizedImage = colorizeDyeAble(img, sheetData, eyeColor)
        }
        const renderData = {
          idx: dim[itm as keyof typeof dim].idx,
          img: colorizedImage ? colorizedImage : img,
          sx: i === 0 ? sheetData.sx : 0,
          sy: i === 1 ? sheetData.sy : 0,
          swidth: dim[itm as keyof typeof dim].x,
          sheight: dim[itm as keyof typeof dim].y,
          dx: (coorOffset.x - dim[itm as keyof typeof dim].x) / 2,
          dy: 0 + coorOffset.y,
          dwidth: dim[itm as keyof typeof dim].x,
          dheight: dim[itm as keyof typeof dim].y
        }
        _sprites[player.name].img.push(renderData)
        _sprites[player.name].length++
        renderPlayerSprite(player.name, ctx)
      }
    }
    img.src = `./assets/sdv/farmer/${dim[itm as keyof typeof dim].file}.png`
  },
  pant(itm, sk, player, ctx) {
    let itemId: string | undefined = undefined

    if (typeof sk?.itemId === "string") itemId = sk.itemId
    if (typeof sk?.itemId === "number") itemId = sk.itemId.toString()

    const sheet_id = itemId ? data_pants[itemId as keyof typeof data_pants].index : -1

    const sheet_offset = getSheetXY(sheet_id, itm)
    const sheetData = {
      sx: sheet_offset.x,
      sy: sheet_offset.y + 672 + (sheet_id >= 10 ? 16 : 0),
      swidth: dim[itm as keyof typeof dim].x,
      sheight: dim[itm as keyof typeof dim].y,
      dx: 0,
      dy: 0,
      dwidth: dim[itm as keyof typeof dim].x,
      dheight: dim[itm as keyof typeof dim].y
    }

    const dyeColor = { R: 0, G: 0, B: 0, A: 0 }
    if (data_pants[itemId as keyof typeof data_pants]?.canBeDyed) {
      const attrColor = sk?.clothesColor || { R: 0, G: 0, B: 0, A: 0 }
      dyeColor.R = (attrColor.R || 0) / 255
      dyeColor.G = (attrColor.G || 0) / 255
      dyeColor.B = (attrColor.B || 0) / 255
      dyeColor.A = (attrColor.A || 0) / 255
    }
    const img = new Image()
    img.onload = () => {
      const colorizedImage = colorizeDyeAble(img, sheetData, dyeColor)
      const renderData = {
        idx: dim[itm as keyof typeof dim].idx,
        img: colorizedImage,
        sx: 0,
        sy: 0,
        swidth: dim[itm as keyof typeof dim].x,
        sheight: dim[itm as keyof typeof dim].y,
        dx: (coorOffset.x - dim[itm as keyof typeof dim].x) / 2,
        dy: 17 + coorOffset.y,
        dwidth: dim[itm as keyof typeof dim].x,
        dheight: dim[itm as keyof typeof dim].y
      }
      _sprites[player.name].img.push(renderData)
      _sprites[player.name].length++
      renderPlayerSprite(player.name, ctx)
    }
    img.src = `./assets/sdv/farmer/${dim[itm as keyof typeof dim].file}.png`
  },
  shirt(itm, sk, player, ctx) {
    let itemId: string | undefined = undefined

    if (typeof sk?.itemId === "string") itemId = sk.itemId
    if (typeof sk?.itemId === "number") itemId = sk.itemId.toString()

    const sheet_id = itemId ? data_shirts[itemId as keyof typeof data_shirts].index : -1

    const sheet_offset = getSheetXY(sheet_id, itm)
    const sheetData = {
      sx: sheet_offset.x + (data_shirts[itemId as keyof typeof data_shirts]?.canBeDyed ? 128 : 0),
      sy: sheet_offset.y,
      swidth: dim[itm as keyof typeof dim].x,
      sheight: dim[itm as keyof typeof dim].y,
      dx: 0,
      dy: 0,
      dwidth: dim[itm as keyof typeof dim].x,
      dheight: dim[itm as keyof typeof dim].y
    }

    let img: OffscreenCanvas | HTMLImageElement = new Image()
    img.onload = () => {
      let parseX = sheet_offset.x,
        parseY = sheet_offset.y
      const parseCoorY = player.gender === "Male" ? 14 : 16
      if (data_shirts[itemId as keyof typeof data_shirts]?.canBeDyed) {
        const dyeColor = { R: 255, G: 255, B: 255, A: 255 }
        const attrColor = sk?.clothesColor || { R: 0, G: 0, B: 0, A: 0 }
        dyeColor.R = (attrColor.R || 0) / 255
        dyeColor.G = (attrColor.G || 0) / 255
        dyeColor.B = (attrColor.B || 0) / 255
        dyeColor.A = (attrColor.A || 0) / 255
        img = colorizeDyeAble(img as HTMLImageElement, sheetData, dyeColor)
        parseX = 0
        parseY = 0
      }
      const renderData = {
        idx: dim[itm as keyof typeof dim].idx,
        img,
        sx: parseX,
        sy: parseY,
        swidth: dim[itm as keyof typeof dim].x,
        sheight: dim[itm as keyof typeof dim].y,
        dx: (coorOffset.x - dim[itm as keyof typeof dim].x) / 2,
        dy: parseCoorY + coorOffset.y,
        dwidth: dim[itm as keyof typeof dim].x,
        dheight: dim[itm as keyof typeof dim].y
      }
      _sprites[player.name].img.push(renderData)
      _sprites[player.name].length++
      renderPlayerSprite(player.name, ctx)
    }
    img.src = `./assets/sdv/farmer/${dim[itm as keyof typeof dim].file}.png`
  },
  accessory(itm, sk, player, ctx) {
    const sheet_id = typeof sk === "number" && sk >= 0 ? sk : -1
    const sheet_offset = getSheetXY(sheet_id, itm)

    const img = new Image()
    img.onload = () => {
      const parseCoorY = player.gender === "Male" ? 2 : 3
      const renderData = {
        idx: dim[itm as keyof typeof dim].idx,
        img,
        sx: sheet_offset.x,
        sy: sheet_offset.y,
        swidth: dim[itm as keyof typeof dim].x,
        sheight: dim[itm as keyof typeof dim].y,
        dx: (coorOffset.x - dim[itm as keyof typeof dim].x) / 2,
        dy: parseCoorY + coorOffset.y,
        dwidth: dim[itm as keyof typeof dim].x,
        dheight: dim[itm as keyof typeof dim].y
      }
      _sprites[player.name].img.push(renderData)
      _sprites[player.name].length++
      renderPlayerSprite(player.name, ctx)
    }
    img.src = `./assets/sdv/farmer/${dim[itm as keyof typeof dim].file}.png`
  },
  hair(itm, sk, player, ctx) {
    const ori_sheet_id = sk >= 0 ? sk : -1
    let sheet_id = ori_sheet_id
    let does_change: string | undefined = undefined
    if (player.sprite.hat && player.sprite.hat.hairDrawType >= 1) {
      does_change = Object.keys(data_hairs).find((k) => data_hairs[k as keyof typeof data_hairs].find((oldHair) => oldHair === sheet_id))
      if (does_change) sheet_id = Number(does_change)
    }
    if (ori_sheet_id >= 56) sheet_id = ori_sheet_id - 100

    const sheet_offset = getSheetXY(sheet_id, itm, ori_sheet_id >= 56 ? 1 : 0)

    const sheetData = {
      sx: sheet_offset.x,
      sy: sheet_offset.y,
      swidth: dim[itm as keyof typeof dim].x,
      sheight: dim[itm as keyof typeof dim].y,
      dx: 0,
      dy: 0,
      dwidth: dim[itm as keyof typeof dim].x,
      dheight: dim[itm as keyof typeof dim].y
    }
    const dyeColor = { R: 0, G: 0, B: 0, A: 0 }
    const attrColor = player.sprite.hairstyleColor || { R: 0, G: 0, B: 0, A: 0 }

    dyeColor.R = (attrColor.R || 0) / 255
    dyeColor.G = (attrColor.G || 0) / 255
    dyeColor.B = (attrColor.B || 0) / 255
    dyeColor.A = (attrColor.A || 0) / 255

    let img: OffscreenCanvas | HTMLImageElement = new Image()
    img.onload = () => {
      const parseCoorY = player.gender === "Male" ? 0 : 2
      img = colorizeDyeAble(img as HTMLImageElement, sheetData, dyeColor)
      const renderData = {
        idx: dim[itm as keyof typeof dim].idx,
        img,
        sx: 0,
        sy: 0,
        swidth: dim[itm as keyof typeof dim].x,
        sheight: dim[itm as keyof typeof dim].y,
        dx: (coorOffset.x - dim[itm as keyof typeof dim].x) / 2,
        dy: parseCoorY + coorOffset.y,
        dwidth: dim[itm as keyof typeof dim].x,
        dheight: dim[itm as keyof typeof dim].y
      }
      _sprites[player.name].img.push(renderData)
      _sprites[player.name].length++
      renderPlayerSprite(player.name, ctx)
    }
    img.src = `./assets/sdv/farmer/${dim[itm as keyof typeof dim].file}${ori_sheet_id >= 56 ? "2" : ""}.png`
  },
  hat(itm, sk, player, ctx) {
    let skIdx = -1

    if (sk?.itemId && typeof sk.itemId === "number") {
      skIdx = sk?.itemId >= 0 ? sk.itemId : -1
    }

    if (sk?.itemId && typeof sk.itemId === "string") {
      skIdx = Number(data_hats[sk.itemId as keyof typeof data_hats])
    }

    const sheet_id = Number(skIdx)
    const sheet_offset = getSheetXY(sheet_id, itm)

    const img = new Image()
    img.onload = () => {
      const parseCoorY = player.gender === "Male" ? 0 : 2
      const renderData = {
        idx: dim[itm as keyof typeof dim].idx,
        img,
        sx: sheet_offset.x,
        sy: sheet_offset.y,
        swidth: dim[itm as keyof typeof dim].x,
        sheight: dim[itm as keyof typeof dim].y,
        dx: (coorOffset.x - dim[itm as keyof typeof dim].x) / 2,
        dy: parseCoorY,
        dwidth: dim[itm as keyof typeof dim].x,
        dheight: dim[itm as keyof typeof dim].y
      }
      _sprites[player.name].img.push(renderData)
      _sprites[player.name].length++
      renderPlayerSprite(player.name, ctx)
    }
    img.src = `./assets/sdv/farmer/${dim[itm as keyof typeof dim].file}.png`
  },
  arm(itm, sk, player, ctx) {
    const sheet_id = sk
    const sheet_offset = getSheetXY(sheet_id, itm)
    const img = new Image()
    img.onload = () => {
      for (let i = 0; i < 3; i++) {
        const sheetData = {
          sx: sheet_offset.x + i * 16,
          sy: sheet_offset.y,
          swidth: dim[itm as keyof typeof dim].x,
          sheight: dim[itm as keyof typeof dim].y,
          dx: 0,
          dy: 0,
          dwidth: dim[itm as keyof typeof dim].x,
          dheight: dim[itm as keyof typeof dim].y
        }
        const attrColor = data_skins[i][player.sprite.skin]
        const skinColor = {
          R: (attrColor.R || 0) / 255,
          G: (attrColor.G || 0) / 255,
          B: (attrColor.B || 0) / 255,
          A: (attrColor.A || 0) / 255
        }
        const colorizedImage = colorizeDyeAble(img, sheetData, skinColor)
        const renderData = {
          idx: dim[itm as keyof typeof dim].idx,
          img: colorizedImage,
          sx: 0,
          sy: 0,
          swidth: dim[itm as keyof typeof dim].x,
          sheight: dim[itm as keyof typeof dim].y,
          dx: (coorOffset.x - dim[itm as keyof typeof dim].x) / 2,
          dy: 0 + coorOffset.y,
          dwidth: dim[itm as keyof typeof dim].x,
          dheight: dim[itm as keyof typeof dim].y
        }
        _sprites[player.name].img.push(renderData)
        _sprites[player.name].length++
        renderPlayerSprite(player.name, ctx)
      }
    }
    img.src = `./assets/sdv/farmer/${dim[itm as keyof typeof dim].file}.png`
  }
}

export function playerCard(player: IPlayer, idx: number) {
  const el = document.createElement("div")
  el.classList.add("card")
  el.innerHTML = `
  <div class="sprite sprite-layers">
    <canvas class="canvas canvas-farmer" width="20" height="32"></canvas>
  </div>
  <div class="info">
    <ul>
      <li>${player.name} (P${idx})</li>
      <li>${player.spouse ? "💍 " + player.spouse : "🔑 Single"}</li>
      <li>🕘 ${sdate.durrTime(player.playTime)}</li>
    </ul>
  </div>`

  const inSkin: IInSkin = {
    body: player.gender === "Male" ? 0 : 1,
    eyes: {
      gender: player.gender === "Male" ? 0 : 1,
      eyeColor: player.sprite.newEyeColor
    },
    pant: player.sprite.pantsItem,
    shirt: player.sprite.shirtItem,
    accessory: (player.sprite.accessory || -1) >= 0 ? player.sprite.accessory : -1,
    hair: player.sprite.hair >= 0 ? player.sprite.hair : -1,
    hat: player.sprite.hat,
    arm: player.gender === "Male" ? 0 : 1
  }

  _sprites[player.name] = { img: [], length: 0 }

  const canvas = futor(".canvas-farmer", el) as HTMLCanvasElement
  const ctx = canvas.getContext("2d")!

  Object.keys(inSkin).forEach((sk) => {
    // @ts-expect-error no default types
    getCtx[sk as keyof typeof getCtx](sk, inSkin[sk as keyof typeof inSkin], player, ctx)
  })

  if (player.spouse) {
    const elsprite = futor(".sprite-layers", el)
    elsprite.classList.add("with-spouse")
    const eportrait = document.createElement("div")
    eportrait.classList.add("villager")
    eportrait.innerHTML = `<img src="./assets/sdv/characters/${player.spouse}.png" />`
    elsprite.append(eportrait)
  }
  return el
}
