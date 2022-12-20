import Viva from "vivagraphjs"
import { readInput } from "../lib/readInput.js"
import { part1 } from "./generate.js"

const main = async () => {
  const input: string = await readInput()

  const graph = part1(input)

  // graph.forEachNode((node) => {
  //   console.log(node)
  // })

  var graphics = Viva.Graph.View.svgGraphics()
  graphics
    .node(function (node) {
      return Viva.Graph.svg("rect")
        .attr("width", node.data.flowRate * 2)
        .attr("height", node.data.flowRate * 2)
        .attr("fill", "crimson")
    })
    .link(function (link) {
      return Viva.Graph.svg("line")
        .attr("stroke", "silver")
        .attr("stroke-width", "2px")
    })
    .placeNode(function (nodeUI, pos, node) {
      // Shift image to let links go to the center:
      nodeUI
        .attr("x", pos.x - node.data.flowRate)
        .attr("y", pos.y - node.data.flowRate)
    })

  var renderer = Viva.Graph.View.renderer(graph, {
    graphics: graphics,
  })
  renderer.run()
}

main()
