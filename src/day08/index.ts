import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split("").map(Number))

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const visible = new Set<string>()

  for (let y = 0; y < input.length; y++) {
    let max = -1
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] > max) {
        visible.add(`${y}:${x}`)
        max = input[y][x]
      }
    }

    max = -1
    for (let x = input[0].length - 1; x >= 0; x--) {
      if (input[y][x] > max) {
        visible.add(`${y}:${x}`)
        max = input[y][x]
      }
    }
  }

  for (let x = 0; x < input[0].length; x++) {
    let max = -1
    for (let y = 0; y < input.length; y++) {
      if (input[y][x] > max) {
        visible.add(`${y}:${x}`)
        max = input[y][x]
      }
    }

    max = -1
    for (let y = input.length - 1; y >= 0; y--) {
      if (input[y][x] > max) {
        visible.add(`${y}:${x}`)
        max = input[y][x]
      }
    }
  }

  return visible.size
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]

  const scenicScores: number[] = []

  for (let y = 1; y < input.length - 1; y++) {
    for (let x = 1; x < input[0].length - 1; x++) {
      const treeHeight = input[y][x]
      let scenicScore = 1

      for (const [dY, dX] of dirs) {
        let v = 0
        let i = 0

        while (true) {
          i++
          const next = input[y + dY * i]?.[x + dX * i]

          if (next !== undefined) {
            v++
          }

          if (next >= treeHeight || next === undefined) {
            break
          }
        }
        scenicScore *= v
      }

      scenicScores.push(scenicScore)
    }
  }

  return Math.max(...scenicScores)
}

const testInput = `
  30373
  25512
  65332
  33549
  35390
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 8,
      },
    ],
    solution: part2,
  },
})
