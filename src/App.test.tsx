import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App"

test("focuses new order when adding", async () => {
  render(<App />)
  await userEvent.click(screen.getByText("Add"))
  expect(
    within(screen.getByRole("table")).getAllByRole("spinbutton")[0],
  ).toHaveFocus()
})
