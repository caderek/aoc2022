type Shape = "square" | "circle"
type Color = string | null

type Config = {
  tileColor: Color
  tileShape: Shape
  tileSize: number
  lineColor: Color
  lineSize: number
  gapSize: number
  background: Color
}

type TileStyle = {
  tileColor?: Color
  tileShape?: Shape
  lineColor?: Color
  lineSize?: number
  scale?: number
}

type GridCell = string | number | boolean
type Point = { x: number; y: number }

type Format<T> = (item: T) => TileStyle

const defaultConfig: Config = {
  tileColor: "#eee",
  tileShape: "square",
  tileSize: 8,
  lineColor: null,
  lineSize: 0,
  gapSize: 2,
  background: "#0e0614",
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
    this.#config = { ...this.#config, ...config }
  }

  #registerResizeHandler() {
    window.addEventListener("resize", this.#resize)
  }

  #square(
    x: number,
    y: number,
    tileColor: Color,
    lineColor: Color,
    lineSize: number,
    scale: number = 1,
  ) {
    const tile = this.#config.tileSize
    const gap = this.#config.gapSize
    const offset = (tile * (1 - scale)) / 2

    if (tileColor) {
      this.#ctx.fillStyle = tileColor
      this.#ctx.fillRect(
        x * (tile + gap) + offset,
        y * (tile + gap) + offset,
        tile * scale,
        tile * scale,
      )
    }

    if (lineSize > 0 && lineColor) {
      this.#ctx.strokeStyle = lineColor
      this.#ctx.lineWidth = lineSize
      this.#ctx.strokeRect(
        x * (tile + gap) + offset,
        y * (tile + gap) + offset,
        tile * scale,
        tile * scale,
      )
    }
  }

  #circle(
    x: number,
    y: number,
    tileColor: Color,
    lineColor: Color,
    lineSize: number,
    scale: number = 1,
  ) {
    const tile = this.#config.tileSize
    const gap = this.#config.gapSize
    const size = this.#config.tileSize * scale
    const offset = (this.#config.tileSize * (1 - scale)) / 2 + size / 2

    this.#ctx.beginPath()
    this.#ctx.arc(
      x * (tile + gap) + offset,
      y * (tile + gap) + offset,
      size / 2,
      0,
      Math.PI * 2,
    )

    if (tileColor) {
      this.#ctx.fillStyle = tileColor
      this.#ctx.fill()
    }

    if (lineSize > 0 && lineColor) {
      this.#ctx.strokeStyle = lineColor
      this.#ctx.lineWidth = lineSize
      this.#ctx.stroke()
    }
  }

  #getShapeFn(shape: Shape) {
    if (shape === "circle") {
      return this.#circle.bind(this)
    }

    return this.#square.bind(this)
  }

  drawGrid<T extends GridCell>(grid: T[][], format?: Format<T>) {
    const height = grid.length
    const width = grid[0].length

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let gridCell = grid[y][x]

        if (typeof gridCell === "string") {
          // @ts-ignore
          gridCell = gridCell.trim()
        }

        const style: Required<TileStyle> = {
          tileColor: this.#config.tileColor,
          tileShape: this.#config.tileShape,
          lineColor: this.#config.lineColor,
          lineSize: this.#config.lineSize,
          scale: 1,
          ...(format ? format(gridCell) : {}),
        }

        if (gridCell) {
          this.#getShapeFn(style.tileShape)(
            x,
            y,
            style.tileColor,
            style.lineColor,
            style.lineSize,
            style.scale,
          )
        }
      }
    }
  }

  drawPoints<T extends Point>(points: T[], format?: Format<T>) {
    for (const point of points) {
      const style: Required<TileStyle> = {
        tileColor: this.#config.tileColor,
        tileShape: this.#config.tileShape,
        lineColor: this.#config.lineColor,
        lineSize: this.#config.lineSize,
        scale: 1,
        ...(format ? format(point) : {}),
      }

      this.#getShapeFn(style.tileShape)(
        point.x,
        point.y,
        style.tileColor,
        style.lineColor,
        style.lineSize,
        style.scale,
      )
    }
  }

  clear() {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
  }
}

export default GridCanvas
