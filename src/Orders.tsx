import { ArrayHelpers, Field, FormikProps } from "formik"
import { createRef, RefObject, useEffect, useRef } from "react"

import items from "./items"
import "./Orders.css"
import { Order, Values } from "./types"

const defaultOrder: Order = {
  amount: 5,
  item: "caroot",
  payment: 1,
}

function getItem(item: string) {
  return items.flat().find(({ name }) => name === item)!
}

function mapValues<
  K extends string | number | symbol,
  V,
  O extends Record<K, V>,
  VV
>(object: O, callback: (value: V) => VV): Record<K, VV> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, callback(value)])
  )
}

export function calculateOrders(discount: string, orders: Order[]) {
  return orders.map((order) => {
    let orderItems = getItem(order.item)
    if ("from" in orderItems[0]) {
      orderItems = mapValues(orderItems[0].from).map(getItem)
    }

    const cost = orderItems
      .map(
        (item) =>
          ("cost" in item
            ? item.name === discount
              ? Math.floor(item.cost * 0.5)
              : item.cost
            : 0) * order.amount,
      )
      .reduce((x, y) => x + y)
    const profit = order.payment - cost
    // maximum
    const days = orderItems
      .map((item) => ("days" in item ? item.days : 0))
      .reduce((x, y) => Math.max(x, y))
    const profitPerDay = Math.round(profit / (days || 1))

    return { cost, profit, days, profitPerDay }
  })
}

export default function OrdersForm({
  push,
  remove,
  form: { values },
}: ArrayHelpers & { form: FormikProps<Values> }) {
  const inputRefs = useRef<RefObject<HTMLInputElement>[]>([])
  const addingRow = useRef(false)
  const removedRow = useRef<number>()

  useEffect(() => {
    inputRefs.current.push(
      ...values.orders
        .slice(inputRefs.current.length)
        .map(() => createRef<HTMLInputElement>()),
    )

    const last = inputRefs.current[inputRefs.current.length - 1]?.current

    if (last && addingRow.current) {
      last.focus()
      last.select()
      addingRow.current = false
    }

    if (removedRow.current !== undefined) {
      inputRefs.current.splice(removedRow.current, 1)
      removedRow.current = undefined
    }

    if (!values.orders.length) {
      inputRefs.current = []
    }
  })

  const data = calculateOrders(values.discount, values.orders)

  return (
    <table>
      <thead>
        <tr>
          <th>Items</th>
          <th>Cost</th>
          <th>Payment</th>
          <th>Profit</th>
          <th>Days</th>
          <th>Profit/Day</th>
          <th />
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => {
          function highlightRecommended(
            key: keyof typeof data[0],
            reverse = false,
          ) {
            const results = data
              .map((row, index) => index)
              .sort((a, b) => data[b][key] - data[a][key])

            if (reverse) {
              results.reverse()
            }

            const isRecommended = results.slice(0, values.level).includes(index)
            return isRecommended ? <strong>{row[key]}</strong> : row[key]
          }

          return (
            <tr key={index}>
              <td>
                <Field
                  innerRef={inputRefs.current[index]}
                  name={`orders.${index}.amount`}
                  type="number"
                  step={5}
                  validate={(value: number) => {
                    if (value % 5)
                      return `orders.${index}.amount must by divisible by 5`
                  }}
                  style={{ width: "2.5em" }}
                />

                <Field
                  component="select"
                  name={`orders.${index}.item`}
                  style={{ width: "11em" }}
                >
                  {items.slice(0, values.level).map((items, index) => (
                    <optgroup key={index} label={`Plenny's level ${index + 1}`}>
                      {items.map(({ name }) => (
                        <option key={name}>{name}</option>
                      ))}
                    </optgroup>
                  ))}
                </Field>
              </td>

              <td>{highlightRecommended("cost", true)}</td>

              <td>
                <Field
                  name={`orders.${index}.payment`}
                  type="number"
                  size={5}
                  style={{ width: "4em" }}
                />
              </td>

              <td>{highlightRecommended("profit")}</td>

              <td>{highlightRecommended("days", true)}</td>

              <td>{highlightRecommended("profitPerDay")}</td>

              <td>
                <button
                  type="button"
                  onClick={() => {
                    remove(index)
                    removedRow.current = index
                  }}
                >
                  X
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>

      <tfoot>
        <tr>
          <td colSpan={8}>
            <button
              className="fluid"
              type="button"
              onClick={() => {
                push(defaultOrder)
                addingRow.current = true
              }}
            >
              Add
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
