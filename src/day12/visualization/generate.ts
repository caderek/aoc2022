// @ts-ignore
import createGraph from "https://cdn.skypack.dev/ngraph.graph"
// @ts-ignore
import path from "https://cdn.skypack.dev/ngraph.path"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""))

const neighborsWithCoords = (x: number, y: number, grid: string[][]) => {
  return [
    grid[y - 1]?.[x] ? { val: grid[y - 1][x], x, y: y - 1 } : undefined,
    grid[y][x + 1] ? { val: grid[y][x + 1], x: x + 1, y } : undefined,
    grid[y + 1]?.[x] ? { val: grid[y + 1][x], x, y: y + 1 } : undefined,
    grid[y][x - 1] ? { val: grid[y][x - 1], x: x - 1, y } : undefined,
  ].filter((n) => n !== undefined) as { val: any; x: number; y: number }[]
}

const getElevation = (item: string) => {
  return item === "S" ? 1 : item === "E" ? 26 : item.charCodeAt(0) - 96
}

const buildGraph = (input: string[][]) => {
  const g = createGraph()
  let start = ""
  let end = ""

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const neighbors = neighborsWithCoords(x, y, input)
      const currentElevation = getElevation(input[y][x])
      const nodeName = `${y}:${x}`

      if (input[y][x] === "S") {
        start = nodeName
      }

      if (input[y][x] === "E") {
        end = nodeName
      }

      g.addNode(nodeName, { x, y, val: currentElevation })

      for (const neighbor of neighbors) {
        const neighborElevation = getElevation(neighbor.val)
        if (neighborElevation <= currentElevation + 1) {
          g.addNode(`${neighbor.y}:${neighbor.x}`, {
            x: neighbor.x,
            y: neighbor.y,
            val: neighborElevation,
          })

          g.addLink(nodeName, `${neighbor.y}:${neighbor.x}`)
        }
      }
    }
  }

  return { g, start, end }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { g, start, end } = buildGraph(input)
  const pathFinder = path.nba(g, { oriented: true })

  return pathFinder
    .find(start, end)
    .map((v: any) => v.data)
    .reverse()
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { g, end } = buildGraph(input)
  const pathFinder = path.nba(g, { oriented: true })

  let length = Infinity
  let shortestPath: any[] = []

  g.forEachNode((node: any) => {
    if (node.data.val === 1) {
      const p = pathFinder.find(node.id, end)

      if (p.length && p.length - 1 < length) {
        length = p.length - 1
        shortestPath = p
      }
    }
  })

  return shortestPath.map((v: any) => v.data)
}

export { part1, part2 }
