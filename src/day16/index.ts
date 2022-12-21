import run from "aocrunner"
import createGraph, { Graph, Node } from "ngraph.graph"
import path from "ngraph.path"

type Valve = { name: string; to: string[]; flowRate: number }
type Costs = { [key: string]: { [key: string]: number } }

const parseInput = (rawInput: string): Valve[] =>
  rawInput.split("\n").map((line) => {
    const [name, ...to] = line.match(/([A-Z]{2})/g) ?? []
    const flowRate = Number(line.match(/\d+/)?.[0])

    return { name, to, flowRate }
  })

const getIds = (graph: Graph, exclude: string[]) => {
  const ids: string[] = []

  graph.forEachNode((node) => {
    const id = node.id as string
    if (!exclude.includes(id)) {
      ids.push(id)
    }
  })

  return ids
}

const removeNode = (graph: Graph, node: Node) => {
  const links: { id: string; len: number }[] = []

  node.links?.forEach((link) => {
    if (link.fromId !== node.id) {
      links.push({ id: link.fromId as string, len: link.data.len })
    }
  })

  for (const a of links) {
    for (const b of links) {
      if (a.id !== b.id) {
        // console.log(`${a.id}->${b.id}`)
        const len = a.len + b.len
        const old = graph.getLink(a.id, b.id)

        if (!old) {
          graph.addLink(a.id, b.id, { len })
          continue
        }

        graph.addLink(a.id, b.id, { len: Math.min(len, old.data.len) })
      }
    }
  }

  // console.log(node.id)

  graph.removeNode(node.id)
}

const recreateValves = (valves: Valve[]) => {
  const graph = createGraph()

  for (const { name, to, flowRate } of valves) {
    graph.addNode(name, { flowRate })

    for (const destName of to) {
      graph.addLink(name, destName, { len: 1 })
    }
  }

  graph.forEachNode((node) => {
    if (node.id !== "AA" && node.data.flowRate === 0) {
      removeNode(graph, node)
    }
  })

  return graph
}

const calculateCosts = (graph: Graph, ids: string[]) => {
  const finder = path.nba(graph, {
    distance(_, __, link) {
      return link.data.len
    },
  })

  const costs: Costs = {}

  for (const a of ids) {
    costs[a] = {}

    for (const b of ids) {
      if (a !== b) {
        const p = finder.find(a, b).map((node) => node.id)
        let cost = 0

        for (let i = 0; i < p.length - 1; i++) {
          cost += graph.getLink(p[i], p[i + 1])?.data.len
        }

        costs[a][b] = cost + 1
      }
    }
  }

  return costs
}

const tryCombinations = (
  ids: string[],
  costs: Costs,
  graph: Graph,
  timeLimit: number,
) => {
  const targets = ids.filter((id) => id !== "AA")

  let maxScore = 0
  let bestPath: string[] = []

  let i = 0

  const recur = (timeLeft: number, score: number, prev: string[] = []) => {
    const alreadyOpened = new Set(prev)

    const newTargets = targets.filter((v) => !alreadyOpened.has(v))

    if (newTargets.length === 0) {
      return
    }

    for (const to of newTargets) {
      const from = prev.at(-1) as string
      const newTimeLeft = timeLeft - costs[from][to]

      if (newTimeLeft <= 0) {
        break
      }

      const newScore = score + graph.getNode(to)?.data.flowRate * newTimeLeft

      if (newScore > maxScore) {
        bestPath = [...prev, to]
      }

      maxScore = Math.max(newScore, maxScore)

      recur(newTimeLeft, newScore, [...prev, to])
    }
  }

  recur(timeLimit, 0, ["AA"])

  return { maxScore, bestPath }
}

const checkSolution = (
  path: string[],
  score: number,
  costs: Costs,
  graph: Graph,
) => {
  let realScore = 0
  let timeRemaining = 30
  for (let i = 0; i < path.length - 1; i++) {
    timeRemaining -= costs[path[i]][path[i + 1]]
    realScore += timeRemaining * graph.getNode(path[i + 1])?.data.flowRate
  }

  console.log(score, "===", realScore)
  console.assert(
    score === realScore,
    `Score confirmation failed for ${path.join("->")}`,
  )
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const graph = recreateValves(input)
  const ids = getIds(graph, ["aa"])
  const costs = calculateCosts(graph, ids)

  let timeLimit = 30

  const result = tryCombinations(ids, costs, graph, timeLimit)

  checkSolution(result.bestPath, result.maxScore, costs, graph)

  console.log(result.bestPath.join("->"), result.maxScore)

  return result.maxScore
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

const testInput = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`

const testInputLoop = `
AA 0 BB GG XX
BB 0 AA CC
CC 0 BB DD
DD 0 CC EE
EE 5 DD FF XX
FF 0 EE GG
GG 0 AA FF 
XX 0 AA EE
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 1651,
      },
      {
        input: testInputLoop,
        expected: 27 * 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 1,
      // },
    ],
    solution: part2,
  },
  // onlyTests: true,
})
