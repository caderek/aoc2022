import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.match(/(-?\d+)/g)?.map(Number)) as number[][]


const getRanges = (y: number) => {

}

const part1 = (targetY: number) => (rawInput: string) => {
  const input = parseInput(rawInput)

  const beacons = new Set(input.map((v) => `${v[2]}:${v[3]}`))

  const manhattanDistances = 

  const eq = input.map(([x0, y0, x1, y1]) => {
    const manhattanDistance = Math.abs(x1 - x0) + Math.abs(y1 - y0)

    return (x: number, y: number) =>
      Math.abs(x - x0) + Math.abs(y - y0) <= manhattanDistance
  })

  let nope = 0

  for (let x = -5e6; x <= 5e6; x++) {
    if (eq.some((eq) => eq(x, targetY)) && !beacons.has(`${x}:${targetY}`)) {
      nope++
    }
  }

  return nope
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const eq = input.map(([x0, y0, x1, y1]) => {
    const manhattanDistance = Math.abs(x1 - x0) + Math.abs(y1 - y0)

    return (x: number, y: number) =>
      Math.abs(x - x0) + Math.abs(y - y0) > manhattanDistance
  })

  const max = 20
  // const max = 4000000

  for (let y = 0; y <= max; y++) {
    for (let x = 0; x <= max; x++) {
      if (eq.every((eq) => eq(x, y))) {
        return x * 4000000 + y
      }
    }
  }
}

const testInput = `
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`

run({
  part1: {
    // tests: [
    //   {
    //     input: testInput,
    //     expected: 26,
    //   },
    // ],
    solution: part1(2000000),
  },
  part2: {
    // tests: [
    //   {
    //     input: testInput,
    //     expected: 56000011,
    //   },
    // ],
    solution: part2,
  },
  // onlyTests: true,
})
