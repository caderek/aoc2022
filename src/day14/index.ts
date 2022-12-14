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
  const walls = new Set<string>()
  let maxY = 0

  for (const wallData of input) {
    for (let i = 0; i < wallData.length - 1; i++) {
      let [fromX, fromY] = wallData[i]
      let [toX, toY] = wallData[i + 1]

      maxY = fromY > maxY ? fromY : toY > maxY ? toY : maxY

      for (const y of range_(fromY, toY + (fromY > toY ? -1 : 1))) {
        for (const x of range_(fromX, toX + (fromX > toX ? -1 : 1))) {
          walls.add(`${x}:${y}`)
        }
      }
    }
  }

  return { walls, maxY }
}

const simulateSandUnit = (
  start: Point,
  walls: Set<String>,
  sandUnits: Set<string>,
  stopCondition?: (y: number) => boolean,
) => {
  let [x, y] = start

  while (true) {
    const down = `${x}:${y + 1}`
    const left = `${x - 1}:${y + 1}`
    const right = `${x + 1}:${y + 1}`

    if (stopCondition && stopCondition(y)) {
      return null
    }

    if (!walls.has(down) && !sandUnits.has(down)) {
      y++
    } else if (!walls.has(left) && !sandUnits.has(left)) {
      x--
      y++
    } else if (!walls.has(right) && !sandUnits.has(right)) {
      x++
      y++
    } else {
      return [x, y]
    }
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { walls, maxY } = getWalls(input)

  const stopCondition = (y: number) => y === maxY
  const sandUnits = new Set<string>()

  while (true) {
    const result = simulateSandUnit(START, walls, sandUnits, stopCondition)

    if (result === null) {
      break
    }

    const [x, y] = result
    sandUnits.add(`${x}:${y}`)
  }

  return sandUnits.size
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const { walls, maxY } = getWalls(input)
  const floorY = maxY + 2
  const minRequiredFloorX = range_(START[0] - floorY - 1, START[0] + floorY + 1)

  for (const x of minRequiredFloorX) {
    walls.add(`${x}:${floorY}`)
  }

  const sandUnits = new Set<string>()

  while (true) {
    const [x, y] = simulateSandUnit(START, walls, sandUnits) as Point
    sandUnits.add(`${x}:${y}`)

    if (y == 0) {
      break
    }
  }

  return sandUnits.size
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
