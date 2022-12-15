import run from "aocrunner"

type SensorData = { sensorX: number; sensorY: number; manhattan: number }

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.match(/(-?\d+)/g)?.map(Number)) as number[][]

const mergeRanges = (ranges: [number, number][]) => {
  const [first, ...rest] = ranges.sort((a, b) => a[0] - b[0])

  const merged = [first]

  for (const [nextFrom, nextTo] of rest) {
    const [prevFrom, prevTo] = merged.at(-1) as [number, number]

    if (nextFrom <= prevTo + 1) {
      merged[merged.length - 1] = [prevFrom, Math.max(prevTo, nextTo)]
    } else {
      merged.push([nextFrom, nextTo])
    }
  }

  return merged
}

const getRanges = (
  y: number,
  sensors: SensorData[],
  minX: number = -Infinity,
  maxX: number = Infinity,
) => {
  const ranges: [number, number][] = []

  for (const { sensorX, sensorY, manhattan } of sensors) {
    const distanceToSensor = Math.abs(y - sensorY)
    const offsetX = manhattan - distanceToSensor
    const width = offsetX * 2 + 1

    if (width > 0) {
      const from = sensorX - offsetX
      const to = sensorX + offsetX

      if (to >= minX && from <= maxX) {
        ranges.push([Math.max(minX, from), Math.min(maxX, to)])
      }
    }
  }

  return mergeRanges(ranges)
}

const getSensors = (input: number[][]) => {
  return input.map(([x0, y0, x1, y1]) => ({
    sensorX: x0,
    sensorY: y0,
    manhattan: Math.abs(x1 - x0) + Math.abs(y1 - y0),
  }))
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const targetY = 2000000

  const sensors = getSensors(input)
  const ranges = getRanges(targetY, sensors)

  const beaconsAtTargetY = new Set(
    input.filter((v) => v[3] === targetY).map((v) => v[2]),
  ).size

  return (
    ranges
      .map(([from, to]) => Math.abs(to - from) + 1)
      .reduce((a, b) => a + b, 0) - beaconsAtTargetY
  )
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const max = 4000000

  const sensors = getSensors(input)

  for (let y = 0; y <= max; y++) {
    const ranges = getRanges(y, sensors, 0, max)
    if (ranges.length === 2) {
      const signalX = ranges[0][1] + 1
      return signalX * 4000000 + y
    }
  }
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
