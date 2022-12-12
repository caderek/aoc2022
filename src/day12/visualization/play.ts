import GridCanvas from "../../utils/grid-canvas.js"
import { part1, part2 } from "./generate.js"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const main = async () => {
  const input = await fetch("/src/day12/input.txt").then((res) => res.text())

  //   const input = `Sabqponm
  // abcryxxl
  // accszExk
  // acctuvwj
  // abdefghi`

  const grid = input.split("\n").map((line) => line.split(""))

  const path = part1(input)
  const shortestPath = part2(input)

  const t = 50

  const palette = [
    "#103D20",
    "#224E27",
    "#305E30",
    "#376A36",
    "#417738",
    "#548542",
    "#5E9045",
    "#6A9F49",
    "#7CAD4C",
    "#96B857",
    "#AAC160",
    "#C4C963",
    "#D7D265",
    "#F3C964",
    "#EFBA5D",
    "#ECAA56",
    "#E99C4F",
    "#E58B48",
    "#E17B40",
    "#DE6C39",
    "#DB5E33",
    "#C74D2C",
    "#B34127",
    "#993121",
    "#82221B",
    "#640F14",
  ]

  const canvas = new GridCanvas("canvas", {
    gapSize: 0,
    tileSize: 12,
    background: "#011",
  })

  for (let i = 0; i < path.length; i++) {
    canvas.drawGrid(grid, (item) => {
      const h = item.charCodeAt(0) - 97

      return {
        tileColor: ["S", "E"].includes(item) ? "#14051f" : palette[h],
        tileShape: "square",
        scale: 1,
      }
    })

    if (i === 0) {
      await delay(1000)
    }

    canvas.drawPoints(path.slice(0, i + 1), (_, i) => {
      const hue = Math.floor((360 / path.length) * i) - 180
      return {
        tileColor: `hsl(${hue}, 80%, 70%)`,
        scale: 0.7,
        tileShape: "circle",
        lineColor: `hsl(${hue}, 80%, 15%)`,
        lineSize: 2,
      }
    })

    await delay(t)
  }

  await delay(500)

  for (let i = 0; i < shortestPath.length; i++) {
    canvas.drawGrid(grid, (item) => {
      const h = item.charCodeAt(0) - 97

      return {
        tileColor: ["S", "E"].includes(item) ? "#111" : palette[h],
        tileShape: "square",
        scale: 1,
      }
    })

    canvas.drawPoints(path, (_, i) => {
      const hue = Math.floor((360 / path.length) * i) - 180
      return {
        tileColor: `hsla(${hue}, 80%, 70%, 0.3)`,
        scale: 0.7,
        tileShape: "circle",
        lineColor: `hsla(${hue}, 80%, 15%, 0.3)`,
        lineSize: 2,
      }
    })

    if (i === 0) {
      await delay(500)
    }

    canvas.drawPoints(shortestPath.slice(0, i + 1), (_, i) => {
      const hue = Math.floor((360 / path.length) * i) - 180
      return {
        tileColor: `hsl(${hue}, 80%, 70%)`,
        scale: 0.7,
        tileShape: "circle",
        lineColor: `hsl(${hue}, 80%, 15%)`,
        lineSize: 2,
      }
    })

    await delay(t)
  }

  canvas.drawPoints(shortestPath.slice(-1), () => {
    return {
      tileColor: "crimson",
      tileShape: "circle",
      scale: 0.8,
      lineColor: "#14051f",
      lineSize: 2,
    }
  })
}

main()
