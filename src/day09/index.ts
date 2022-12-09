import run from "aocrunner"

type Point = { x: number; y: number }
type Dir = "R" | "L" | "U" | "D"

const dirs = {
  R: [0, 1],
  L: [0, -1],
  D: [1, 0],
  U: [-1, 0],
}

const neighbors = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const [dir, amount] = line.split(" ")
    return [dir, Number(amount)] as [Dir, number]
  })

const areTouching = (head: Point, tail: Point) => {
  return (
    (head.x === tail.x && head.y === tail.y) ||
    neighbors.some(
      (neighbor) =>
        tail.y + neighbor[0] === head.y && tail.x + neighbor[1] === head.x,
    )
  )
}

const moveTail = (head: Point, tail: Point) => {
  const dx = head.x - tail.x
  const dy = head.y - tail.y
  const y = tail.y + dy / (Math.abs(dy) || 1)
  const x = tail.x + dx / (Math.abs(dx) || 1)

  return { y, x }
}

const solve = (length: number) => (rawInput: string) => {
  const input = parseInput(rawInput)
  const visited = new Set<string>(["0:0"])
  let rope = Array.from({ length }, () => ({ y: 0, x: 0 }))

  for (let [dir, amount] of input) {
    while (amount--) {
      for (let i = 0; i < rope.length - 1; i++) {
        if (i === 0) {
          rope[i].y += dirs[dir][0]
          rope[i].x += dirs[dir][1]
        }

        if (!areTouching(rope[i], rope[i + 1])) {
          rope[i + 1] = moveTail(rope[i], rope[i + 1])
        }
      }
      const tail = rope.at(-1) as Point
      visited.add(`${tail.y}:${tail.x}`)
    }
  }

  return visited.size
}

const testInput = `
  R 4
  U 4
  L 3
  D 1
  R 4
  D 1
  L 5
  R 2
`

const testInput2 = `
  R 5
  U 8
  L 8
  D 3
  R 17
  D 10
  L 25
  U 20
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: solve(2),
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 1,
      },
      {
        input: testInput2,
        expected: 36,
      },
    ],
    solution: solve(10),
  },
})
