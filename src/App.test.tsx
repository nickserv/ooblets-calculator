import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App"

test("focuses new order when adding", () => {
  render(<App />)
  userEvent.click(screen.getByText("Add"))
  expect(document.querySelector("table input")).toHaveFocus()
})
