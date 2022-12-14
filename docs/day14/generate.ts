import { range_ } from "@arrows/array"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) =>
      line.split(" -> ").map((item) => item.split(",").map(Number)),
    )

const getWalls = (input: number[][][]) => {
  const points = new Set<string>()

  for (const wallData of input) {
    for (let i = 0; i < wallData.length - 1; i++) {
      const [fromX, fromY] = wallData[i]
      const [toX, toY] = wallData[i + 1]

      if (fromX === toX) {
        const one = fromY > toY ? -1 : 1
        for (const y of range_(fromY, toY + one)) {
          points.add(`${fromX}:${y}`)
        }
      }

      if (fromY === toY) {
        const one = fromX > toX ? -1 : 1
        for (const x of range_(fromX, toX + one)) {
          points.add(`${x}:${fromY}`)
        }
      }
    }
  }

  return points
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  console.log(input)
  const walls = getWalls(input)

  return walls
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

export { part1 }
