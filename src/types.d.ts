export interface Order {
  amount: number
  item: string
  payment: number
}

export interface Values {
  level: number
  discount: string
  orders: Order[]
}
