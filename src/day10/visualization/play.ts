import GridCanvas from "../../utils/grid-canvas.js"
import { part2 } from "./generate.js"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const main = async () => {
  const input = await fetch("/src/day10/input.txt").then((res) => res.text())

  const screens = part2(input)

  const t = 200

  const canvas = new GridCanvas("canvas", {
    gapSize: 4,
    tileSize: 24,
    tileColor: "#202",
    tileShape: "circle",
    background: "#101",
  })

  let last = []

  for (const { screen, register, cycle, lit } of screens) {
    canvas.clear()
    canvas.fillArea(6, 40)

    const sprite = Array.from({ length: 6 }, (_, y) =>
      Array.from({ length: 3 }, (_, x) => ({ y, x: x + register - 1 })),
    )
      .flat()
      .filter((v) => v.x < 40 && v.y < 6)

    canvas.drawPoints(sprite, () => ({
      tileColor: "#ffffff22",
    }))

    canvas.drawGrid(screen, () => {
      return {
        tileColor: "crimson",
      }
    })

    const cursor = { x: (cycle - 1) % 40, y: Math.floor((cycle - 1) / 40) }

    if (cursor.y < 6) {
      canvas.drawPoints([cursor], () => ({
        tileColor: lit ? "#ffffff" : "#ffffff77",
      }))
    }

    await delay(t)
    last = screen
  }

  canvas.clear()
  canvas.fillArea(6, 40)
  canvas.drawGrid(last, () => {
    return {
      tileColor: "crimson",
    }
  })
}

main()
