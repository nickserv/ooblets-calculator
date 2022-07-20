import { calculateOrders } from "./Orders"

const discount = "lopauliflowers"
const orders = [
  { amount: 20, item: "sweetiebeeties", payment: 286 },
  { amount: 20, item: "planklets", payment: 78 },
  { amount: 15, item: "clothlets", payment: 195 },
  { amount: 10, item: "caroot", payment: 91 },
  { amount: 30, item: "pompadoots", payment: 1248 },
  { amount: 15, item: "springbeans", payment: 144 },
  { amount: 20, item: "muz flour", payment: 192 },
  { amount: 10, item: "lopauliflowers", payment: 384 },
  { amount: 30, item: "hop dobs", payment: 1080 },
  { amount: 20, item: "flooti karioka", payment: 1200 },
  { amount: 15, item: "clambrosia", payment: 600 },
  { amount: 40, item: "oodles", payment: 1920 },
  { amount: 30, item: "pibblepug pies", payment: 5112 },
  { amount: 40, item: "go go cupcakes", payment: 9600 },
  { amount: 40, item: "spressies", payment: 3840 },
  { amount: 40, item: "blue goo pie", payment: 9600 },
]

test("calculates orders", () => {
  expect(calculateOrders(discount, orders)).toMatchSnapshot()
})
