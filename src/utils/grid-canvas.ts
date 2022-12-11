type Shape = "square" | "circle"
type Color = string | null

type Config = {
  fill: {
    slot: Color
    tile: Color
  }
  sizes: {
    tile: number
    gap: number
  }
  shapes: {
    tile: Shape
    slot: Shape
  }
  stroke: {
    tile: Color
    slot: Color
  }
  background: Color
  showSlots: boolean
}

type TileStyle = {
  fill?: Color
  stroke?: Color
  scale?: number
  shape?: Shape
}

type GridCell = string | number | boolean
type Point = { x: number; y: number }

type Format<T> = (item: T) => TileStyle

const defaultConfig: Config = {
  fill: {
    slot: "#140a1c",
    tile: "#eee",
  },
  sizes: {
    tile: 8,
    gap: 2,
  },
  shapes: {
    tile: "square",
    slot: "square",
  },
  stroke: {
    tile: null,
    slot: null,
  },
  background: "#0e0614",
  showSlots: true,
}

class GridCanvas {
  #canvas: HTMLCanvasElement
  #ctx: CanvasRenderingContext2D
  #config: Config = defaultConfig

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

    this.#updateConfig(config)
    this.#resize()
    this.#registerResizeHandler()

    this.#canvas.style.background = this.#config.background ?? "transparent"
  }

  #updateConfig(config: Partial<Config> = {}) {
    if (config.showSlots) {
      this.#config.showSlots = config.showSlots
    }
    if (config.fill) {
      this.#config.fill = { ...this.#config.fill, ...config.fill }
    }
    if (config.shapes) {
      this.#config.shapes = { ...this.#config.shapes, ...config.shapes }
    }
    if (config.sizes) {
      this.#config.sizes = { ...this.#config.sizes, ...config.sizes }
    }
  }

  #registerResizeHandler() {
    window.addEventListener("resize", this.#resize)
  }

  #square(x: number, y: number, fill: Color, stroke: Color, scale: number = 1) {
    const tile = this.#config.sizes.tile
    const gap = this.#config.sizes.gap
    const offset = (tile * (1 - scale)) / 2

    if (fill) {
      this.#ctx.fillStyle = fill
      this.#ctx.fillRect(
        x * (tile + gap) + offset,
        y * (tile + gap) + offset,
        tile * scale,
        tile * scale,
      )
    }

    if (stroke) {
      this.#ctx.strokeStyle = stroke
      this.#ctx.lineWidth = 1
      this.#ctx.strokeRect(
        x * (tile + gap) + offset,
        y * (tile + gap) + offset,
        tile * scale,
        tile * scale,
      )
    }
  }

  #circle(x: number, y: number, fill: Color, stroke: Color, scale: number = 1) {
    const tile = this.#config.sizes.tile
    const gap = this.#config.sizes.gap
    const size = this.#config.sizes.tile * scale
    const offset = (this.#config.sizes.tile * (1 - scale)) / 2 + size / 2

    this.#ctx.beginPath()
    this.#ctx.arc(
      x * (tile + gap) + offset,
      y * (tile + gap) + offset,
      size / 2,
      0,
      Math.PI * 2,
    )

    if (fill) {
      this.#ctx.fillStyle = fill
      this.#ctx.fill()
    }

    if (stroke) {
      this.#ctx.strokeStyle = stroke
      this.#ctx.lineWidth = 1
      this.#ctx.stroke()
    }
  }

  #getShapeFn(shape: Shape) {
    if (shape === "circle") {
      return this.#circle.bind(this)
    }

    return this.#square.bind(this)
  }

  drawGrid<T extends GridCell>(data: T[][], format?: Format<T>) {
    console.log(this.#config)

    const height = data.length
    const width = data[0].length

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let gridCell = data[y][x]

        if (typeof gridCell === "string") {
          // @ts-ignore
          gridCell = gridCell.trim()
        }

        if (this.#config.showSlots) {
          this.#getShapeFn(this.#config.shapes.slot)(
            x,
            y,
            this.#config.fill.slot,
            this.#config.stroke.slot,
          )
        }

        const style: Required<TileStyle> = {
          fill: this.#config.fill.tile,
          stroke: this.#config.stroke.tile,
          scale: 1,
          shape: this.#config.shapes.tile,
          ...(format ? format(gridCell) : {}),
        }

        if (gridCell) {
          this.#getShapeFn(style.shape)(
            x,
            y,
            style.fill,
            style.stroke,
            style.scale,
          )
        }
      }
    }
  }

  drawPoints<T extends Point>(data: T, format?: Format<T>) {}
}

export default GridCanvas
