import GridCanvas from "../lib/grid-canvas.js"
import { readInput } from "../lib/readInput.js"
import { getWalls, part1, part2 } from "./generate.js"

const frame = () => new Promise((resolve) => requestAnimationFrame(resolve))

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const main = async () => {
  const input: string = await readInput()
  let speed = 1

  const { blocked: initial, maxY, minX, maxX } = getWalls(input, true)

  console.log({ minX, maxX, maxY })

  const toCanvasPoints = (set: Set<string>) =>
    Array.from(set).map((v) => {
      const [x, y] = v.split(":").map(Number)
      return { x: x - minX, y }
    })

  const walls = toCanvasPoints(initial)

  const canvas = new GridCanvas("canvas", {
    gapSize: 0,
    tileSize: 5,
    background: "#090b12",
  })

  let skip = 0

  let lastBlocked

  for (const { unitPos, blocked } of part2(input)) {
    lastBlocked = blocked
    if (skip === 0) {
      canvas.clear()

      canvas.drawPoints([{ x: unitPos[0] - minX, y: unitPos[1] }], () => ({
        tileColor: "SandyBrown",
        tileShape: "circle",
      }))

      canvas.drawPoints(toCanvasPoints(blocked), () => ({
        tileColor: "SandyBrown",
        tileShape: "circle",
      }))

      canvas.drawPoints(walls, (_, i) => {
        const mod = (Math.trunc(i * Math.PI) % 5) + 7
        const color = "#" + mod.toString(16) + "22222"

        return {
          tileColor: color,
        }
      })

      canvas.drawPoints([{ x: 500 - minX, y: 0 }], () => ({
        tileColor: "teal",
      }))

      speed *= 1.01
      await frame()
    }
    skip++
    skip = skip % Math.round(speed)
  }

  canvas.clear()

  canvas.drawPoints(toCanvasPoints(lastBlocked), () => ({
    tileColor: "SandyBrown",
    tileShape: "circle",
  }))

  canvas.drawPoints(walls, () => ({ tileColor: "FireBrick" }))

  canvas.drawPoints([{ x: 500 - minX, y: 0 }], () => ({ tileColor: "teal" }))
}

main()
