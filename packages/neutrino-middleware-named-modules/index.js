const { NamedModulesPlugin } = require('webpack');

module.exports = ({ config }) => config.plugin('named-modules', NamedModulesPlugin);
