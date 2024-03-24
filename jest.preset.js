const path = require('path')
const nxPreset = require('@nx/jest/preset').default

const jestConfig = {
  ...nxPreset,
}

const jestSetupPath = path.resolve(__dirname, 'jestSetup.js')

jestConfig.setupFilesAfterEnv = (jestConfig.setupFilesAfterEnv || []).concat([
  jestSetupPath,
])

module.exports = jestConfig
