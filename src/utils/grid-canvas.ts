type Shape = "square" | "circle"

type Config = {
  colors: {
    background: string
    slot: string
    tile: string
  }
  sizes: {
    tile: number
    gap: number
  }
  shapes: {
    tile: Shape
    slot: Shape
  }
  showSlots: boolean
}

type TileData = {
  color?: string
  size?: number
  shape?: Shape
}

type Grid = (string | number | boolean | TileData)[][]
type Points = ({ x: number; y: number } & TileData)[]

const defaultConfig: Config = {
  colors: {
    background: "#000",
    slot: "#111",
    tile: "#eee",
  },
  sizes: {
    tile: 20,
    gap: 10,
  },
  shapes: {
    tile: "square",
    slot: "square",
  },
  showSlots: false,
}

class GridCanvas {
  #canvas: HTMLCanvasElement
  #ctx: CanvasRenderingContext2D
  #config: Config

  #resize = () => {
    this.#canvas.width = this.#canvas.clientWidth
    this.#canvas.height = this.#canvas.clientHeight
  }

  constructor(selector: string, config: Partial<Config> = {}) {
    const canvas = document.querySelector(selector)

    if (canvas === null) {
      throw new Error("Provided selector does not exist.")
    }

    this.#canvas = canvas as HTMLCanvasElement
    this.#ctx = this.#canvas.getContext("2d") as CanvasRenderingContext2D
    this.#config = { ...defaultConfig, ...config }

    this.#registerResizeHandler()
  }

  #registerResizeHandler() {
    window.addEventListener("resize", this.#resize)
  }

  #rect(x: number, y: number, color: string, size: number) {
    const offset = (config.tileSize * (1 - size)) / 2
    this.#ctx.fillStyle = color
    this.#ctx.fillRect(
      x * config.tileSize + config.gap * x + offset,
      y * config.tileSize + config.gap * y + offset,
      config.tileSize * size,
      config.tileSize * size,
    )
  }

  draw(data: Grid | Points) {}
}

// const grid = [
//   [1, 0, 0, 0, 0, 1, 0],
//   [0, 0, 0, 0, 1, 1, 0],
//   [1, 0, 0, 1, 0, 1, 1],
//   [1, 1, 0, 0, 1, 1, 0],
//   [0, 0, 1, 0, 0, 1, 1],
//   [1, 0, 0, 1, 0, 1, 0],
//   [0, 1, 0, 1, 0, 1, 1],
// ]

// const config = {
//   tileSize: 20,
//   tileSlotColor: "#160b1f",
//   gap: 10,
// }

// const rect = (x: number, y: number, color: string, size: number) => {}

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// const draw = async () => {
//   ctx.clearRect(0, 0, canvas.width, canvas.height)
//   for (let y = 0; y < grid.length; y++) {
//     for (let x = 0; x < grid.length; x++) {
//       if (config.tileSlotColor) {
//         rect(x, y, "#160b1f")
//       }

//       // if (grid[y][x]) {
//       //   rect(x, y, "#f55", 0.8;
//       // }

//       if (Math.random() > 0.5) {
//         rect(x, y, "#f55", Math.random())
//       }
//     }
//   }

//   await delay(100)
//   requestAnimationFrame(draw)
// }

// draw()

// window.addEventListener("resize", () => {
//   canvas.width = canvas.clientWidth
//   canvas.height = canvas.clientHeight
// })
