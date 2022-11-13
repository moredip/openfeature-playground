/* eslint-disable */
export default {
  displayName: 'openfeature-hooks',
  preset: '../../jest.preset.js',
  transform: {
    // '^.+\\.[tj]sx?$': 'babel-jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/openfeature-hooks',
}
