import fs from "node:fs"
import path from "node:path"
import esbuild from "esbuild"

const VIS_FOLDER = "docs"

const dayFolders = fs
  .readdirSync(VIS_FOLDER)
  .filter((item) => item.startsWith("day"))

for (const dayFolder of dayFolders) {
  console.log(dayFolder)

  esbuild.buildSync({
    entryPoints: [path.join(VIS_FOLDER, dayFolder, "play.ts")],
    target: ["es2022"],
    bundle: true,
    minify: true,
    outfile: path.join(VIS_FOLDER, dayFolder, "play.js"),
  })
}
