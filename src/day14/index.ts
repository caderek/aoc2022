import { range_ } from "@arrows/array"
import run from "aocrunner"

type Point = [number, number]

const START: Point = [500, 0]

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) =>
      line.split(" -> ").map((item) => item.split(",").map(Number)),
    )

const getWalls = (input: number[][][]) => {
  const blocked = new Set<string>()
  let maxY = 0

  for (const wallData of input) {
    for (let i = 0; i < wallData.length - 1; i++) {
      let [fromX, fromY] = wallData[i]
      let [toX, toY] = wallData[i + 1]

      maxY = Math.max(fromY, toY, maxY)

      for (const y of range_(fromY, toY + (fromY > toY ? -1 : 1))) {
        for (const x of range_(fromX, toX + (fromX > toX ? -1 : 1))) {
          blocked.add(`${x}:${y}`)
        }
      }
    }
  }

  return { blocked, maxY }
}

const simulateSandUnit = (
  blocked: Set<String>,
  stopCondition?: (y: number) => boolean,
) => {
  let [x, y] = START

  while (true) {
    if (stopCondition && stopCondition(y)) {
      return null
    }

    if (!blocked.has(`${x}:${y + 1}`)) {
      y++
    } else if (!blocked.has(`${x - 1}:${y + 1}`)) {
      x--
      y++
    } else if (!blocked.has(`${x + 1}:${y + 1}`)) {
      x++
      y++
    } else {
      return [x, y]
    }
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { blocked, maxY } = getWalls(input)
  const wallsCount = blocked.size

  const stopCondition = (y: number) => y === maxY

  while (true) {
    const result = simulateSandUnit(blocked, stopCondition)

    if (result === null) {
      break
    }

    const [x, y] = result
    blocked.add(`${x}:${y}`)
  }

  return blocked.size - wallsCount
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { blocked, maxY } = getWalls(input)
  const floorY = maxY + 2
  const minRequiredFloorX = range_(START[0] - floorY, START[0] + floorY + 1)

  for (const x of minRequiredFloorX) {
    blocked.add(`${x}:${floorY}`)
  }

  const wallsCount = blocked.size

  while (true) {
    const [x, y] = simulateSandUnit(blocked) as Point
    blocked.add(`${x}:${y}`)

    if (y == 0) {
      break
    }
  }

  return blocked.size - wallsCount
}

const testInput = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 93,
      },
    ],
    solution: part2,
  },
})
