import { readCachedProjectGraph } from '@nrwl/devkit'
import { execSync } from "child_process"
import { readFileSync } from 'fs'
import semver from "semver"
import chalk from "chalk"

function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message))
    process.exit(1)
  }
}

const [, , nxProjectName] = process.argv

// some of the following based on the sample `publish.mjs` script provide by NX: https://github.com/nrwl/nx/blob/c0a0f1691373996f1b76622143c5646168ef1eb3/packages/js/src/utils/minimal-publish-script.ts
const graph = readCachedProjectGraph()
const project = graph.nodes[nxProjectName]

invariant(
  project,
  `Could not find project "${nxProjectName}" in the workspace. Is the project.json configured correctly?`,
)

const outputPath = project.data?.targets?.build?.options?.outputPath
invariant(
  outputPath,
  `Could not find "build.options.outputPath" of project "${nxProjectName}". Is project.json configured correctly?`,
)

process.chdir(outputPath)

console.log(`checking package versions...`)
console.log('')

const packageDotJson = JSON.parse(readFileSync(`./package.json`).toString())
const packageName = packageDotJson.name
const localPackageVersion = packageDotJson.version
console.log(`             package name: ${chalk.green(packageName)}`)
console.log(`    local package version: ${chalk.green(localPackageVersion)}`)

const publishedPackageVersion = execSync(`npm show ${packageName} version`,{encoding:'utf-8'})
console.log(`published package version: ${chalk.green(publishedPackageVersion)}`)

if( semver.lte(localPackageVersion,publishedPackageVersion) ){
  console.log(`local version is not higher than published version; ${chalk.underline('no publishing required')}.`)
  process.exit(0)
}

console.log('local version is higher than published version; publishing local package to NPM...')

const [otp] = process.env.NPM_OTP.split(' ')

let extraArgs 
if(otp){
  extraArgs = ` --otp ${otp}`
}

execSync(`npm publish${extraArgs}`,{stdio:'inherit'})
