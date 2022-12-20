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
  fitViewport: boolean
  center: boolean
  fit: boolean
  cameraWidth: number | null
  cameraHeight: number | null
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

type FormatCell<T> = (item: T, x: number, y: number) => TileStyle
type FormatPoint<T> = (item: T, index: number) => TileStyle

const defaultConfig: Config = {
  tileColor: "#eee",
  tileShape: "square",
  tileSize: 8,
  lineColor: null,
  lineSize: 0,
  gapSize: 2,
  background: "#0e0614",
  fitViewport: true,
  center: true,
  fit: true,
  cameraWidth: null,
  cameraHeight: null,
}

class GridCanvas {
  #canvas: HTMLCanvasElement
  #ctx: CanvasRenderingContext2D
  #config: Config = defaultConfig
  #tileSize: number
  #gapSize: number

  #resize = () => {
    const pixelRatio = window.devicePixelRatio
    this.#canvas.width = Math.floor(this.#canvas.clientWidth * pixelRatio)
    this.#canvas.height = Math.floor(this.#canvas.clientHeight * pixelRatio)
    this.#calculateSizes()
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

  #calculateSizes() {
    if (
      this.#config.fit &&
      this.#config.cameraWidth &&
      this.#config.cameraHeight
    ) {
      const maxTile = Math.min(
        Math.floor(this.#canvas.width / this.#config.cameraWidth),
        Math.floor(this.#canvas.height / this.#config.cameraHeight),
      )

      this.#tileSize =
        maxTile < this.#config.tileSize ? maxTile : this.#config.tileSize
    }
  }

  #getOffset() {
    if (
      this.#config.center &&
      this.#config.cameraWidth &&
      this.#config.cameraHeight
    ) {
      const x = Math.round(
        (this.#canvas.width -
          (this.#config.cameraWidth * this.#tileSize +
            (this.#config.cameraWidth - 1) * this.#config.gapSize)) /
          2,
      )

      const y = Math.round(
        (this.#canvas.height -
          (this.#config.cameraHeight * this.#tileSize +
            (this.#config.cameraHeight - 1) * this.#config.gapSize)) /
          2,
      )

      return [x, y]
    }

    return [0, 0]
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
    const tile = this.#tileSize
    const gap = this.#config.gapSize
    const [cameraOffsetX, cameraOffsetY] = this.#getOffset()
    const offset = (tile * (1 - scale)) / 2

    if (tileColor) {
      this.#ctx.fillStyle = tileColor
      this.#ctx.fillRect(
        x * (tile + gap) + offset + cameraOffsetX,
        y * (tile + gap) + offset + cameraOffsetY,
        tile * scale,
        tile * scale,
      )
    }

    if (lineSize > 0 && lineColor) {
      this.#ctx.strokeStyle = lineColor
      this.#ctx.lineWidth = lineSize
      this.#ctx.strokeRect(
        x * (tile + gap) + offset + cameraOffsetX,
        y * (tile + gap) + offset + cameraOffsetY,
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
    const tile = this.#tileSize
    const gap = this.#config.gapSize
    const size = this.#tileSize * scale
    const [cameraOffsetX, cameraOffsetY] = this.#getOffset()
    const offset = (this.#tileSize * (1 - scale)) / 2 + size / 2

    this.#ctx.beginPath()
    this.#ctx.arc(
      x * (tile + gap) + offset + cameraOffsetX,
      y * (tile + gap) + offset + cameraOffsetY,
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

  fillArea(height: number, width: number, format?: FormatCell<boolean>) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const style: Required<TileStyle> = {
          tileColor: this.#config.tileColor,
          tileShape: this.#config.tileShape,
          lineColor: this.#config.lineColor,
          lineSize: this.#config.lineSize,
          scale: 1,
          ...(format ? format(true, x, y) : {}),
        }

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

  drawGrid<T extends GridCell>(grid: T[][], format?: FormatCell<T>) {
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
          ...(format ? format(gridCell, x, y) : {}),
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

  drawPoints<T extends Point>(points: T[], format?: FormatPoint<T>) {
    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const style: Required<TileStyle> = {
        tileColor: this.#config.tileColor,
        tileShape: this.#config.tileShape,
        lineColor: this.#config.lineColor,
        lineSize: this.#config.lineSize,
        scale: 1,
        ...(format ? format(point, i) : {}),
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
