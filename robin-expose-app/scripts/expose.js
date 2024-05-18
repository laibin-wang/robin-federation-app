import slash from 'slash'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { statSync, writeFileSync, readFileSync, readFile, readdirSync } from 'node:fs'

const rootDir = process.cwd()
const pageDir = join(rootDir, 'src/views/')

const meus = []
let exposes = {} // key-value的形式存储

// 递归查找page.json文件的所在的路径
function getPageJson (filePath) {
  const pages = readdirSync(filePath)

  for (let index = 0, len = pages.length; index < len; index++) {
    const page = pages[index]
    const virtualPath = join(filePath, page)

    // 如果是目录，则递归读取该目录下的文件
    if (isDir(virtualPath)) {
      getPageJson(virtualPath)
    } else {
      // 如果是page.json
      page === 'page.json' && readPageJson(virtualPath)
    }
  }
}

// 读取page.json的文件内容转化菜单和共享模块
function readPageJson (path) {
  const info =  readFileSync(path, { encoding: 'utf8' })
  const pageName = pathToName(path)
  const vuePath = pathToExpose(path)
  const pageInfo = JSON.parse(info)
  pageInfo.name = pageName
  meus.push(pageInfo)
  exposes[`./${pageName}`] = vuePath
}

// 写入系统平铺所有菜单
function writeFlattedMenus () {
  const pagePath = join(rootDir, 'public/flatted-menus.json')
  execSync(`rm -rf ${pagePath}`)
  writeFileSync(pagePath, JSON.stringify(meus, null, 2))
}

// 通过page.json文件路径转成name
function pathToName (path) {
  path = slash(path)
  path = path.replace(slash(pageDir), '').replace('/page.json', '')
  return path.split('/').join('-')
}

// 通过page.json文件路径解析正index.vue 路径以及相应key
function pathToExpose (path) {
  path = slash(path)
  const vuePath = path.replace(slash(process.cwd()), '.').replace('page.json', 'index.vue')
  return vuePath
}

// 判断该文件是目录还是文件
const isDir = function (path) {
  const stats = statSync(path)
  return stats.isDirectory()
}

 const run = function() {
  getPageJson(pageDir)
  writeFlattedMenus()
  return exposes
}

export {
  run
}

