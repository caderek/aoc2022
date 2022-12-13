import { zip_ } from "@arrows/array"
import run from "aocrunner"
import { isDeepStrictEqual } from "util"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n\n")
    .map((line) => line.split("\n").map((v) => JSON.parse(v)))

const compare = (a: any, b: any): 1 | -1 | 0 => {
  if (a === b) {
    return 0
  }

  if (a !== undefined && b === undefined) {
    return -1
  }

  if (a === undefined && b !== undefined) {
    return 1
  }

  if (typeof a === "number" && typeof b === "number") {
    return a < b ? 1 : a === b ? 0 : -1
  }

  if (typeof a === "number" && Array.isArray(b)) {
    return compare([a], b)
  }

  if (typeof b === "number" && Array.isArray(a)) {
    return compare(a, [b])
  }

  for (const [aa, bb] of zip_.all(b, a)) {
    const r = compare(aa, bb)

    if (r === 0) {
      continue
    }

    return r
  }

  return 0
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let sumOfIndices = 0

  input.forEach(([a, b], index) => {
    const inOrder = compare(a, b)

    if (inOrder === 1 || inOrder === 0) {
      sumOfIndices += index + 1
    }
  })

  return sumOfIndices
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
    .concat([[[[2]], [[6]]]])
    .flat()

  const sorted = input.sort(compare).reverse()

  const a = sorted.findIndex((v) => isDeepStrictEqual(v, [[2]]))
  const b = sorted.findIndex((v) => isDeepStrictEqual(v, [[6]]))

  return (a + 1) * (b + 1)
}

const testInput = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 140,
      },
    ],
    solution: part2,
  },
  // onlyTests: true,
})
