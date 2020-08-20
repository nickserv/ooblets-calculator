import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App"

test("focuses new order when adding", async () => {
  render(<App />)
  userEvent.click(screen.getByText("Add"))
  await waitFor(() =>
    expect(document.querySelector("table input")).toHaveFocus()
  )
})
