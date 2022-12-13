import pako from 'pako'

const readInput = async () => {
  const res = await fetch('./dist/input')
  const data = await res.arrayBuffer()

  return pako.ungzip(data, {to: 'string'})

}

export {readInput}