import run from "aocrunner"
import graph, { Graph } from "graphlib"

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
  const g = new Graph({ directed: true })
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

      for (const neighbor of neighbors) {
        const neighborElevation = getElevation(neighbor.val)
        if (neighborElevation <= currentElevation + 1) {
          g.setEdge(nodeName, `${neighbor.y}:${neighbor.x}`)
        }
      }
    }
  }

  return { g, start, end }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { g, start, end } = buildGraph(input)

  return graph.alg.dijkstra(g, start)[end].distance
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { g, end } = buildGraph(input)

  const distances: number[] = []

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] === "a") {
        distances.push(graph.alg.dijkstra(g, `${y}:${x}`)[end].distance)
      }
    }
  }

  return Math.min(...distances)
}

const testInput = `
  Sabqponm
  abcryxxl
  accszExk
  acctuvwj
  abdefghi
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 29,
      },
    ],
    solution: part2,
  },
})
