export default {
  displayName: 'statgpt-global-trusted-data-commons',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/statgpt-global-trusted-data-commons',
  transformIgnorePatterns: ['/node_modules/(?!react-dnd|dnd-core|@react-dnd|@epam)'],
};
