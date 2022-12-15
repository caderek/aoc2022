import { range_ } from "@arrows/array"

type Point = [number, number]

const START: Point = [500, 0]

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) =>
      line.split(" -> ").map((item) => item.split(",").map(Number)),
    )

const getWalls = (rawInput: string, withFloor: boolean = false) => {
  const input = parseInput(rawInput)
  const blocked = new Set<string>()
  let maxY = 0
  let minX = Infinity
  let maxX = 0

  for (const wallData of input) {
    for (let i = 0; i < wallData.length - 1; i++) {
      let [fromX, fromY] = wallData[i]
      let [toX, toY] = wallData[i + 1]

      maxY = Math.max(fromY, toY, maxY)
      minX = Math.min(fromX, toX, minX)
      maxX = Math.max(fromX, toX, maxX)

      for (const y of range_(fromY, toY + (fromY > toY ? -1 : 1))) {
        for (const x of range_(fromX, toX + (fromX > toX ? -1 : 1))) {
          blocked.add(`${x}:${y}`)
        }
      }
    }
  }

  if (withFloor) {
    const floorY = maxY + 2
    const minRequiredFloorX = range_(START[0] - floorY, START[0] + floorY + 1)

    for (const x of minRequiredFloorX) {
      minX = Math.min(x, minX)
      maxX = Math.max(x, maxX)
      blocked.add(`${x}:${floorY}`)
    }
  }

  return { blocked, maxY, minX, maxX }
}

const simulateSandUnit = (
  blocked: Set<String>,
  stopCondition?: (y: number) => boolean,
) => {
  let [x, y] = START
  const path = [START]

  while (true) {
    if (stopCondition && stopCondition(y)) {
      return null
    }

    if (!blocked.has(`${x}:${y + 1}`)) {
      y++
      path.push([x, y])
    } else if (!blocked.has(`${x - 1}:${y + 1}`)) {
      x--
      y++
      path.push([x, y])
    } else if (!blocked.has(`${x + 1}:${y + 1}`)) {
      x++
      y++
      path.push([x, y])
    } else {
      return path
    }
  }
}

function* part1(rawInput: string) {
  const { blocked, maxY } = getWalls(rawInput)

  const stopCondition = (y: number) => y === maxY

  while (true) {
    const result = simulateSandUnit(blocked, stopCondition)

    if (result === null) {
      break
    }

    const [x, y] = result.at(-1) as Point
    blocked.add(`${x}:${y}`)

    for (const unitPos of result) {
      yield { unitPos, blocked }
    }
  }
}

function* part2(rawInput: string) {
  const { blocked, maxY } = getWalls(rawInput, true)

  while (true) {
    const result = simulateSandUnit(blocked)
    const [x, y] = result?.at(-1) as Point
    blocked.add(`${x}:${y}`)

    for (const unitPos of result as Point[]) {
      yield { unitPos, blocked }
    }

    if (y == 0) {
      break
    }
  }
}

export { getWalls, part1, part2 }
