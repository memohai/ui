import fs from 'fs'
import path from 'path'

const rootDir = path.resolve(import.meta.dirname, '../src')
const readDir = path.resolve(rootDir, './components')
const outputDir = path.resolve(rootDir, './index.ts')

// Hand-maintained named re-exports that do NOT come from a components/* barrel:
// the menu/select class builders live in src/lib and are imported by name by app
// code. The generator must re-emit them or every `pnpm build` silently drops
// them from src/index.ts. They are spliced after the command barrel to keep the
// output byte-identical to the historical hand-written ordering.
const libExportLines = [
  'export { menuItemClass, menuLabelClass, menuContentClass, menuViewportClass, menuChromeClass, virtualListboxClass, menuAlignOffset, menuSearchHeaderClass, menuSearchInputClass, menuSeparatorClass, menuSlideClass } from \'./lib/menu\'',
  'export { selectTriggerClass } from \'./lib/trigger\'',
]
const libExportAnchor = 'export * from \'./components/command/index\''

async function readDirName(){  
  const pathList:Awaited<string[]> = await new Promise((resolve, reject) => {
    fs.readdir(readDir, (err, data) => {
      if (err) {    
         reject(err)
      }
      resolve(data)
     })
   })
   return pathList 
}

async function writeExportFile(pathList: string[]) {
  const lines = pathList.map(fileName => {
    return `export * from './components/${fileName}/index'`
  })
  const anchorIndex = lines.indexOf(libExportAnchor)
  if (anchorIndex === -1) {
    throw new Error(`gen-entry: anchor not found, refusing to drop lib exports: ${libExportAnchor}`)
  }
  lines.splice(anchorIndex + 1, 0, ...libExportLines)
  // LF only: joining with \r\n rewrites every line of src/index.ts and turns a
  // one-line change into a full-file diff.
  await new Promise<void>((resolve, reject) => {
    fs.writeFile(outputDir, lines.join('\n') + '\n', (err) => {
      if (err) {
        reject(err)
      }
      resolve(undefined)
    })
  })
}

async function generate() {
  try {
    const list = await readDirName()
    // readdir order is filesystem-dependent; sort so the barrel is byte-stable
    // across machines (local dev vs CI).
    writeExportFile(list.sort())
  } catch(error) {
    console.error(error)
  }
}

generate()