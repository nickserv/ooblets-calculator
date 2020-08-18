import { Field, FieldArray, Form, Formik, FormikErrors } from "formik"
import { Persist } from "formik-persist"
import React from "react"
import { array, mixed, number, object } from "yup"

import items from "./items"
import Orders from "./Orders"
import { Values, Order } from "./types"

export default function App() {
  return (
    <>
      <h1>
        <a href="https://ooblets.com/">Ooblets</a> Calculator
      </h1>
      <p>
        Visit <a href="https://ooblets.gamepedia.com/Plenny's">Plenny's</a> and
        enter what bulk orders you have available today. We'll tell you how you
        can best make a profit.
      </p>

      <Formik<Values>
        initialValues={{
          level: 1,
          discount: "none",
          orders: [],
        }}
        validationSchema={object().shape({
          level: number().integer().min(1).max(4),
          discount: mixed().oneOf([
            "none",
            ...items
              .flat()
              .filter((item) => "cost" in item)
              .map((item) => item.name),
          ]),
          orders: array().of(
            object().shape({
              amount: number().integer().min(5),
              item: mixed().oneOf(items.flat().map((item) => item.name)),
              payment: number().integer().min(1),
            })
          ),
        })}
        onSubmit={() => {}}
      >
        {({ errors, values }) => (
          <Form>
            <input type="reset" />

            <div>
              <label>
                Plenny's level:
                <Field name="level" type="number" min={1} max={4} />
              </label>
            </div>

            <div>
              <label>
                Meed's discount:
                <Field
                  component="select"
                  name="discount"
                  style={{ width: "9em" }}
                >
                  <option>none</option>
                  {items.slice(0, values.level).map((items, index) => (
                    <optgroup key={index} label={`Plenny's level ${index + 1}`}>
                      {items
                        .filter((item) => "cost" in item)
                        .map(({ name }) => (
                          <option key={name}>{name}</option>
                        ))}
                    </optgroup>
                  ))}
                </Field>
              </label>
            </div>

            <h2>Orders</h2>
            <FieldArray
              name="orders"
              // @ts-ignore
              component={Orders}
            />

            {errors && <h2>Errors</h2>}
            <ul>
              {[
                errors.level,
                errors.discount,
                ...((errors.orders as
                  | FormikErrors<Order>[]
                  | undefined)?.flatMap(Object.values) ?? []),
              ]
                .filter((error) => error)
                .map((error) => (
                  <li key={error}>{error}</li>
                ))}
            </ul>

            <Persist name="form" />
          </Form>
        )}
      </Formik>

      <p>
        <a href="https://github.com/nickmccurdy/ooblets-calculator">
          Source on GitHub
        </a>
      </p>
    </>
  )
}
