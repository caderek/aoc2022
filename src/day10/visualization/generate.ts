type Command = { cmd: "noop" } | { cmd: "addx"; val: number }

const chunk = <T>(chunkSize: number, arr: T[]) => {
  if (chunkSize <= 0) {
    throw new Error("Chunk size has to be greater than 0.")
  }

  const chunks = new Array(Math.ceil(arr.length / chunkSize))

  for (let i = 0, j = 0; i < arr.length; i = i + chunkSize, j++) {
    chunks[j] = arr.slice(i, i + chunkSize)
  }

  return chunks
}

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
  let signalStrengthSum = 0

  const nexCycle = () => {
    cycle++

    if (cycle >= 20 && (cycle - 20) % 40 === 0) {
      signalStrengthSum += cycle * register
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

  return signalStrengthSum
}

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
      yield { screen: chunk(40, screen), register, cycle, lit }
    } else {
      nexCycle()
      yield { screen: chunk(40, screen), register, cycle, lit }
      nexCycle()
      yield { screen: chunk(40, screen), register, cycle, lit }
      register += item.val
    }
  }

  return [chunk(40, screen), register]
}

export { part1, part2 }
