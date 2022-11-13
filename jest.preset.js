const path = require('path')
const nxPreset = require('@nrwl/jest/preset').default;

const jestConfig = { 
  ...nxPreset 
};

const jestSetupPath = path.resolve(__dirname, 'jestSetup.js')

jestConfig.setupFilesAfterEnv = (jestConfig.setupFilesAfterEnv || []).concat([jestSetupPath])

module.exports = jestConfig
