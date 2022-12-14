import GridCanvas from "../lib/grid-canvas.js"
import { readInput } from "../lib/readInput.js"
import { part1 } from "./generate.js"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const main = async () => {
  const input = await readInput()

  const walls = Array.from(part1(input)).map((v) => {
    const [x, y] = v.split(":").map(Number)
    return { x: x - 350, y }
  })

  const t = 50

  const canvas = new GridCanvas("canvas", {
    gapSize: 0,
    tileSize: 6,
    background: "#070011",
  })

  canvas.drawPoints(walls, () => ({ tileColor: "gray" }))

  canvas.drawPoints([{ x: 500 - 350, y: 0 }], () => ({ tileColor: "red" }))
}

main()
