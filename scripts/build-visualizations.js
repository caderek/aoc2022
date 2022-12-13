import fs from "node:fs"
import path from "node:path"
import esbuild from "esbuild"
import pako from "pako"

const VIS_FOLDER = "docs"

const dayFolders = fs
  .readdirSync(VIS_FOLDER)
  .filter((item) => item.startsWith("day"))

for (const dayFolder of dayFolders) {
  const distFolder = path.join(VIS_FOLDER, dayFolder, "dist")

  if (fs.existsSync(distFolder)) {
    fs.rmSync(distFolder, { recursive: true })
  }

  esbuild.buildSync({
    entryPoints: [path.join(VIS_FOLDER, dayFolder, "main.ts")],
    target: ["es2022"],
    bundle: true,
    minify: true,
    outfile: path.join(distFolder, "main.js"),
  })

  const input = fs.readFileSync(path.join("src", dayFolder, "input.txt"), {
    encoding: "utf8",
  })

  const compressed = pako.gzip(input)

  fs.writeFileSync(path.join(distFolder, "input"), compressed)
}
