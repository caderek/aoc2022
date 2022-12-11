import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput.split("\n\n").map((line) => {
    const [, items, op, test, ifTrue, ifFalse] = line.split("\n")

    return {
      items: (items.match(/(\d+)/g) ?? []).map(Number),
      operation: (old: Number) =>
        eval(op.slice(19).replace(/old/g, String(old))),
      divisor: Number((test.match(/(\d+)/g) ?? [])[0]),
      ifTrue: Number((ifTrue.match(/(\d+)/g) ?? [])[0]),
      ifFalse: Number((ifFalse.match(/(\d+)/g) ?? [])[0]),
      inspected: 0,
    }
  })

const solve =
  (rounds: number, divisor: number = 1) =>
  (rawInput: string) => {
    const monkeys = parseInput(rawInput)

    const mul = monkeys.reduce((acc, item) => acc * item.divisor, 1)

    let round = rounds

    while (round--) {
      for (const monkey of monkeys) {
        while (monkey.items.length > 0) {
          monkey.inspected++
          const item = monkey.items.shift()
          const worryLevel = monkey.operation(item as number)
          const worryLevelAfter = Math.floor(worryLevel / divisor) % mul

          const targetIndex =
            worryLevelAfter % monkey.divisor === 0
              ? monkey.ifTrue
              : monkey.ifFalse

          monkeys[targetIndex].items.push(worryLevelAfter)
        }
      }
    }

    return monkeys
      .map((monkey) => monkey.inspected)
      .sort((a, b) => a - b)
      .slice(-2)
      .reduce((a, b) => a * b)
  }

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

const testInput = `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 10605,
      },
    ],
    solution: solve(20, 3),
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 2713310158,
      },
    ],
    solution: solve(10000),
  },
})
