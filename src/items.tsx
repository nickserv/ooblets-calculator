// Re-export items.json with better types
import inferredItems from "./items.json"

type Item = { name: string } & (
  | {}
  | { cost: number; days: number }
  | { from: string[] }
)

const items: Item[][] = inferredItems
export default items
