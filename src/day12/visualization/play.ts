import GridCanvas from "../../utils/grid-canvas.js"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const main = async () => {
  const input = await fetch("/src/day12/input.txt").then((res) => res.text())
  const grid = input.split("\n").map((line) => line.split(""))

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
    tileSize: 8,
    background: "#011",
  })

  canvas.drawGrid(grid, (item) => {
    const h = item.charCodeAt(0) - 97

    return {
      tileColor: ["S", "E"].includes(item) ? "white" : palette[h],
      tileShape: "square",
      scale: 1,
    }
  })
}

main()
