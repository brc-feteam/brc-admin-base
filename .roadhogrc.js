const path = require('path')

export default {
  // 接口代理示例
  proxy: {
    "/api/v1/weather": {
      "target": "https://api.seniverse.com/",
      "changeOrigin": true,
      "pathRewrite": { "^/api/v1/weather": "/v3/weather" }
    },
    "/api/v2": {
      "target": "http://127.0.0.1:7001/",
      "changeOrigin": true,
      "pathRewrite": { "^/api/v2": "/" }
    }
  },
  dllPlugin: {
    exclude: ["babel-runtime", "roadhog", "cross-env"],
    include: ["dva/router", "dva/saga", "dva/fetch"]
  },
  env: {
    development: {
      // extraBabelPlugins: [
      //   "dva-hmr",
      //   "transform-runtime",
      //   [
      //     "import", {
      //       "libraryName": "antd",
      //       "style": true
      //     }
      //   ]
      // ]
    },
    production: {
      extraBabelPlugins: [
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "style": true
          }
        ]
      ]
    }
  },
}
