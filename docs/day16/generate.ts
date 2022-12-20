import createGraph, { Graph, Node } from "ngraph.graph"
import Viva from "vivagraphjs"

type Valve = { name: string; to: string[]; flowRate: number }

const parseInput = (rawInput: string): Valve[] =>
  rawInput.split("\n").map((line) => {
    const [name, ...to] = line.match(/([A-Z]{2})/g) ?? []
    const flowRate = Number(line.match(/\d+/)?.[0])

    return { name, to, flowRate }
  })

const removeNode = (graph: Graph, node: Node) => {
  const l: { id: string; len: number }[] = []

  node.links?.forEach((link) => {
    if (link.fromId !== node.id) {
      l.push({ id: link.fromId as string, len: link.data.len })
    }
  })

  for (const a of l) {
    for (const b of l) {
      if (a.id !== b.id && !graph.hasLink(a.id, b.id)) {
        graph.addLink(a.id, b.id, { len: a.len + b.len })
      }
    }
  }

  graph.removeNode(node.id)
}

const recreateValves = (valves: Valve[]) => {
  const graph = Viva.Graph.graph()

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

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const graph = recreateValves(input)
  let minutesLeft = 30

  return graph
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

export { part1 }
