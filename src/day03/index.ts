import run from "aocrunner"
import { chunk_ } from "@arrows/array"

const parseInput = (rawInput: string) => rawInput.split("\n")

const getPriority = (char: string) => {
  const code = char.charCodeAt(0)
  return code >= 97 ? code - 96 : code - 65 + 27
}

const findCommon = (a: string[], b: string[]) => {
  const set = new Set(a)
  return b.filter((char) => set.has(char))
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).map((line) => {
    return [
      line.slice(0, line.length / 2).split(""),
      line.slice(line.length / 2).split(""),
    ]
  })

  return input
    .map(([a, b]) => {
      const set = new Set(a)
      const common = b.find((char) => set.has(char)) as string
      return getPriority(common)
    })
    .reduce((a, b) => a + b)
}

const part2 = (rawInput: string) => {
  const input = chunk_(
    3,
    parseInput(rawInput).map((line) => line.split("")),
  )

  return input
    .map(([a, b, c]) => {
      const commonAB = findCommon(a, b)
      const commonABC = findCommon(commonAB, c)[0]
      return getPriority(commonABC)
    })
    .reduce((a, b) => a + b)
}

const testInput = `
  vJrwpWtwJgWrhcsFMMfFFhFp
  jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
  PmmdzqPrVvPwwTWBwg
  wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
  ttgJtRGJQctTZtZT
  CrZsJsPPZsGzwwsLwLmpwMDw
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 70,
      },
    ],
    solution: part2,
  },
  // onlyTests: true,
})
