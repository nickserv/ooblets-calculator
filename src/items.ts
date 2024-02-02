// Re-export items.json with better types
import inferredItems from "./items.json"

type Item = { name: string } & (
  | {}
  | { cost: number; days: number }
  | { from: Record<string, number> }
)

const items: Item[][] = inferredItems
export default items
