import { ArrayHelpers, Field, FormikProps } from "formik"
import React from "react"

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

export default function OrdersForm({
  push,
  remove,
  form: { values },
}: ArrayHelpers & { form: FormikProps<Values> }) {
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
        {values.orders.map((order, index) => {
          let orderItems = [getItem(order.item)]
          if ("from" in orderItems[0]) {
            orderItems = orderItems[0].from.map(getItem)
          }

          const cost = orderItems
            .map(
              (item) =>
                ("cost" in item
                  ? item.name === values.discount
                    ? Math.floor(item.cost * 0.5)
                    : item.cost
                  : 0) * order.amount
            )
            .reduce((x, y) => x + y)
          const profit = order.payment - cost
          // maximum
          const days = orderItems
            .map((item) => ("days" in item ? item.days : 0))
            .reduce((x, y) => Math.max(x, y))
          const profitPerDay = Math.round(profit / (days || 1))

          return (
            <tr key={index}>
              <td>
                <Field
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

              <td>{cost}</td>

              <td>
                <Field
                  name={`orders.${index}.payment`}
                  type="number"
                  size={5}
                  style={{ width: "4em" }}
                />
              </td>

              <td>{profit}</td>

              <td>{days}</td>

              <td>{profitPerDay}</td>

              <td>
                <button type="button" onClick={() => remove(index)}>
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
              onClick={() => push(defaultOrder)}
            >
              Add
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
