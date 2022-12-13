import { chunk_ } from "@arrows/array"

type Command = { cmd: "noop" } | { cmd: "addx"; val: number }

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const [cmd, val] = line.split(" ")
    return (
      cmd === "noop" ? { cmd: cmd } : { cmd: cmd, val: Number(val) }
    ) as Command
  })

function* part2(rawInput: string) {
  const input = parseInput(rawInput)
  let register = 1
  let cycle = 0
  let screen: string[] = []
  let lit = false

  const nexCycle = () => {
    cycle++

    const pixelPosInLine = (cycle - 1) % 40

    lit = pixelPosInLine >= register - 1 && pixelPosInLine <= register + 1

    screen.push(lit ? "#" : " ")
  }

  for (const item of input) {
    if (item.cmd === "noop") {
      nexCycle()
      yield { screen: chunk_(40, screen), register, cycle, lit }
    } else {
      nexCycle()
      yield { screen: chunk_(40, screen), register, cycle, lit }
      nexCycle()
      yield { screen: chunk_(40, screen), register, cycle, lit }
      register += item.val
    }
  }

  return [chunk_(40, screen), register, cycle, lit]
}

export { part2 }
