// Use require.context to require reducers automatically
// Ref: https://webpack.js.org/guides/dependency-management/#require-context
const context = require.context('./', false, /\.js$/);
export default context
  .keys()
  .filter(item => item !== './index.js' && item.indexOf('base.js') === -1)
  .map(key => context(key));
