import { chunk_ } from "@arrows/array"
import run from "aocrunner"

type Command = { cmd: "noop" } | { cmd: "addx"; val: number }

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const [cmd, val] = line.split(" ")
    return (
      cmd === "noop" ? { cmd: cmd } : { cmd: cmd, val: Number(val) }
    ) as Command
  })

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let register = 1
  let cycle = 0
  let signalStrength = 0

  const nexCycle = () => {
    cycle++

    if (cycle >= 20 && (cycle - 20) % 40 === 0) {
      signalStrength += cycle * register
    }
  }

  for (const item of input) {
    if (item.cmd === "noop") {
      nexCycle()
    } else {
      nexCycle()
      nexCycle()
      register += item.val
    }
  }

  return signalStrength
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let register = 1
  let cycle = 0
  let screen: string[] = []

  const nexCycle = () => {
    cycle++

    const pixelPosInline = (cycle - 1) % 40
    const isPixelInsideSprite =
      pixelPosInline >= register - 1 && pixelPosInline <= register + 1

    screen.push(isPixelInsideSprite ? "█" : " ")
  }

  for (const item of input) {
    if (item.cmd === "noop") {
      nexCycle()
    } else {
      nexCycle()
      nexCycle()
      register += item.val
    }
  }

  return chunk_(40, screen)
    .map((line) => line.join(""))
    .join("\n")
}

const testInput = `
  addx 15
  addx -11
  addx 6
  addx -3
  addx 5
  addx -1
  addx -8
  addx 13
  addx 4
  noop
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx -35
  addx 1
  addx 24
  addx -19
  addx 1
  addx 16
  addx -11
  noop
  noop
  addx 21
  addx -15
  noop
  noop
  addx -3
  addx 9
  addx 1
  addx -3
  addx 8
  addx 1
  addx 5
  noop
  noop
  noop
  noop
  noop
  addx -36
  noop
  addx 1
  addx 7
  noop
  noop
  noop
  addx 2
  addx 6
  noop
  noop
  noop
  noop
  noop
  addx 1
  noop
  noop
  addx 7
  addx 1
  noop
  addx -13
  addx 13
  addx 7
  noop
  addx 1
  addx -33
  noop
  noop
  noop
  addx 2
  noop
  noop
  noop
  addx 8
  noop
  addx -1
  addx 2
  addx 1
  noop
  addx 17
  addx -9
  addx 1
  addx 1
  addx -3
  addx 11
  noop
  noop
  addx 1
  noop
  addx 1
  noop
  noop
  addx -13
  addx -19
  addx 1
  addx 3
  addx 26
  addx -30
  addx 12
  addx -1
  addx 3
  addx 1
  noop
  noop
  noop
  addx -9
  addx 18
  addx 1
  addx 2
  noop
  noop
  addx 9
  noop
  noop
  noop
  addx -1
  addx 2
  addx -37
  addx 1
  addx 3
  noop
  addx 15
  addx -21
  addx 22
  addx -6
  addx 1
  noop
  addx 2
  addx 1
  noop
  addx -10
  noop
  noop
  addx 20
  addx 1
  addx 2
  addx 2
  addx -6
  addx -11
  noop
  noop
  noop
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`,
      },
    ],
    solution: part2,
  },
  // onlyTests: true,
})
