import run from "aocrunner"

type Move = "A" | "B" | "C"
type Response = "X" | "Y" | "Z"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(" ")) as [Move, Response][]

const names = { X: "A", Y: "B", Z: "C" }
const values = { A: 1, B: 2, C: 3 }
const wins = { A: "C", B: "A", C: "B" }
const loses = { C: "A", A: "B", B: "C" }
const outcomes = { X: 0, Y: 3, Z: 6 }

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input
    .map(([a, b]) => {
      const v = names[b] as Move
      return (a === v ? 3 : wins[v] === a ? 6 : 0) + values[v]
    })
    .reduce((a, b) => a + b)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input
    .map(([a, b]) => {
      const item = (b === "X" ? wins[a] : b === "Y" ? a : loses[a]) as Move
      return outcomes[b] + values[item]
    })
    .reduce((a, b) => a + b)
}

const testInput = `
  A Y
  B X
  C Z
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
