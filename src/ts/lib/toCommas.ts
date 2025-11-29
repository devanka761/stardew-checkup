export function toCommas(amount: number | string, symbol: string = ","): string {
  const money = typeof amount === "number" ? amount.toString() : amount

  return money.replace(/\B(?=(\d{3})+(?!\d))/g, symbol)
}
