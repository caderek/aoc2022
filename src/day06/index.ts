import run from "aocrunner"

const parseInput = (rawInput: string) => Buffer.from(rawInput, "ascii")

const solve = (frameSize: number) => (rawInput: string) => {
  const input = parseInput(rawInput)
  let i = 0

  while (true) {
    if (new Set(input.subarray(i, i + frameSize)).size === frameSize) {
      return i + frameSize
    }
    i++
  }
}

run({
  part1: {
    tests: [
      {
        input: "mjqjpqmgbljsphdztnvjfqwrcgsmlb",
        expected: 7,
      },
    ],
    solution: solve(4),
  },
  part2: {
    tests: [
      {
        input: "mjqjpqmgbljsphdztnvjfqwrcgsmlb",
        expected: 19,
      },
    ],
    solution: solve(14),
  },
})
