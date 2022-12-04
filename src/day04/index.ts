import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split(",").map((item) => item.split("-").map(Number)))

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input.filter(
    ([a, b]) =>
      (a[0] >= b[0] && a[1] <= b[1]) || (b[0] >= a[0] && b[1] <= a[1]),
  ).length
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input.filter(([a, b]) => !(a[0] > b[1] || b[0] > a[1])).length
}

const testInput = `
  2-4,6-8
  2-3,4-5
  5-7,7-9
  2-8,3-7
  6-6,4-6
  2-6,4-8
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 4,
      },
    ],
    solution: part2,
  },
})
