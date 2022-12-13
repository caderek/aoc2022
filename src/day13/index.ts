import run from "aocrunner"
import { zip_ } from "@arrows/array"
import { isDeepStrictEqual } from "util"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n\n")
    .map((line) => line.split("\n").map((v) => JSON.parse(v)))

const compare = (a: any, b: any): number => {
  if (a === b) {
    return 0
  }

  if (a === undefined) {
    return -1
  }

  if (b === undefined) {
    return 1
  }

  if (typeof a === "number" && typeof b === "number") {
    return a - b
  }

  if (typeof a === "number") {
    return compare([a], b)
  }

  if (typeof b === "number") {
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
    const val = compare(a, b)

    if (val <= 0) {
      sumOfIndices += index + 1
    }
  })

  return sumOfIndices
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
    .concat([[[[2]], [[6]]]])
    .flat()

  const sorted = input.sort(compare)

  const a = sorted.findIndex((v) => isDeepStrictEqual(v, [[2]])) + 1
  const b = sorted.findIndex((v) => isDeepStrictEqual(v, [[6]])) + 1

  return a * b
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
})
