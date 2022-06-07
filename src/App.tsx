import { Field, FieldArray, Form, Formik, FormikErrors } from "formik"
import { Persist } from "formik-persist"
import React from "react"
import { array, mixed, number, object } from "yup"
import logo from "./images/ooblets-logo.png";
import banner from "./images/legsy-dance.jpg";

import items from "./items"
import Orders from "./Orders"
import { Values, Order } from "./types"

export default function App() {
  return (
    <>
      <a href="https://ooblets.com/" className="ooblets-logo"><img src={logo} alt="Ooblets Logo"></img></a> 
      <div>
        <h1>
          Calculator
        </h1>
        <img className="banner" src={banner} alt="The ooblet Legsy is mid-dance pose."></img>
      </div>
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
              amount: number().integer().min(5).max(40),
              item: mixed().oneOf(items.flat().map((item) => item.name)),
              payment: number().integer().min(1),
            })
          ),
        })}
        onSubmit={() => {}}
      >
        {({ errors, values }) => (
          <Form>
            <div>
              <label>
                Plenny's level
                <br />
                <Field name="level" type="number" min={1} max={4} className="user-inputs" style={{ margin: "10px 0 0 0"}}/>
              </label>
            </div>

            <div>
              <label>
                Meed's discount
                <br />
                <Field
                  component="select"
                  name="discount"
                  style={{ width: "9em", margin: "10px 0 0 0"}}
                  className="user-inputs"
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

            <input type="reset" className="button-ooblets--danger"/>

            <h2 style={{ margin: "100px 0 30px 0"}}>Orders</h2>
            <div className="table-container">
              <FieldArray
                name="orders"
                // @ts-ignore
                component={Orders}
              />
            </div>

            {Object.keys(errors).length ? <h2 className="text--danger">Errors</h2> : null}
            <ul>
              {[
                errors.level,
                errors.discount,
                ...((
                  errors.orders as FormikErrors<Order>[] | undefined
                )?.flatMap(Object.values) ?? []),
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
      <footer>
        <p>Ooblet images and names are registered trademarks or trademarks of © 2016-2021 Glumberland LLC.</p>
      </footer>
    </>
  )
}
