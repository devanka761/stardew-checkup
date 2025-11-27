export function toMoney(amount: number | string): string {
  const money = typeof amount === "number" ? amount.toString() : amount

  return money.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
