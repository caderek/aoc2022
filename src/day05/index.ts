import run from "aocrunner"

const rotateRight = <T>(arr: T[][]) => {
  const width = arr[0].length
  const height = arr.length
  const rotated = Array.from({ length: width }, () => new Array(height))

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      rotated[x][height - y - 1] = arr[y][x]
    }
  }

  return rotated
}

const splitByColumns = (data: string) => {
  const chars = data.split("\n").map((line) => line.split(""))
  return rotateRight(chars).map((col) => col.join("").trim())
}

const parseInput = (rawInput: string) => {
  const [stacks, commands] = rawInput.split("\n\n")
  return {
    stacks: splitByColumns(stacks)
      .filter((line) => /[A-Z]/.test(line))
      .map((col) => col.slice(1).split("")),
    commands: commands
      .split("\n")
      .map((command) => (command.match(/(\d+)/g) ?? []).map(Number)),
  }
}

const part1 = (rawInput: string) => {
  const { stacks, commands } = parseInput(rawInput)

  for (let [amount, from, to] of commands) {
    const source = stacks[from - 1]
    const target = stacks[to - 1]

    while (amount && source.length > 0) {
      target.push(source.pop() as string)
      amount--
    }
  }

  return stacks
    .map((stack) => stack.at(-1))
    .filter((v) => v !== undefined)
    .join("")
}

const part2 = (rawInput: string) => {
  const { stacks, commands } = parseInput(rawInput)
  const temp = []

  for (let [amount, from, to] of commands) {
    const source = stacks[from - 1]
    const target = stacks[to - 1]

    while (amount && source.length > 0) {
      temp.push(source.pop() as string)
      amount--
    }

    while (temp.length > 0) {
      target.push(temp.pop() as string)
    }
  }

  return stacks
    .map((stack) => stack.at(-1))
    .filter((v) => v !== undefined)
    .join("")
}

const testInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
})
