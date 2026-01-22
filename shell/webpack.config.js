const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'shell',

  remotes: {
    mfe1: 'mfe1@http://localhost:4300/remoteEntry.js',
    mfe2: 'mfe2@http://localhost:4400/remoteEntry.js',
    // add more remotes as needed
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
