import run from "aocrunner"

type Cube = [x: number, y: number, z: number]
type Surrounded = { [key: string]: number }

const dirs: Cube[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
]

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(",").map(Number)) as Cube[]

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const ids = new Set(input.map((cube) => cube.join(",")))

  let surfaceArea = 0

  for (const [x, y, z] of input) {
    surfaceArea += dirs.filter(([dX, dY, dZ]) => {
      const neighborId = `${x + dX},${y + dY},${z + dZ}`
      return !ids.has(neighborId)
    }).length
  }

  return surfaceArea
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const ids = new Set(input.map((cube) => cube.join(",")))

  const airIds = new Set<string>()
  let surfaceArea = 0

  for (const [x, y, z] of input) {
    surfaceArea += dirs.filter(([dX, dY, dZ]) => {
      const neighborId = `${x + dX},${y + dY},${z + dZ}`

      if (!ids.has(neighborId)) {
        airIds.add(neighborId)

        return true
      }

      return false
    }).length
  }

  const all = new Set([...ids, ...airIds])
  let closedSurfaceArea = 0

  for (const [x, y, z] of [...airIds].map((id) => id.split(",").map(Number))) {
    let partOfPockets = 0
    const isPartOfPocket = dirs.every(([dX, dY, dZ]) => {
      const neighborId = `${x + dX},${y + dY},${z + dZ}`
      if (ids.has(neighborId)) {
        partOfPockets++
      }

      return all.has(neighborId)
    })

    if (isPartOfPocket) {
      closedSurfaceArea += partOfPockets
    }
  }

  return surfaceArea - closedSurfaceArea
}

const testInput = `
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 58,
      },
    ],
    solution: part2,
  },
  // onlyTests: true,
})
