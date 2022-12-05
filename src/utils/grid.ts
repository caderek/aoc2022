/**
 * Rotate nested array (2d grid)
 */
export const rotate = {
  right<T>(arr: T[][]) {
    const width = arr[0].length
    const height = arr.length
    const rotated = Array.from({ length: width }, () => new Array(height))

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        rotated[x][height - y - 1] = arr[y][x]
      }
    }

    return rotated
  },

  left<T>(arr: T[][]) {
    const width = arr[0].length
    const height = arr.length
    const rotated = Array.from({ length: width }, () => new Array(height))

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        rotated[width - x - 1][y] = arr[y][x]
      }
    }

    return rotated
  },

  by180<T>(arr: T[][]) {
    return arr.reverse().map((row) => row.reverse())
  },
}

/**
 * Flip nested array (2d grid)
 */
export const flip = {
  vertically<T>(arr: T[][]) {
    return arr.reverse()
  },

  horizontally<T>(arr: T[][]) {
    return arr.map((row) => row.reverse())
  },
}

export default {
  rotate,
  flip,
}
