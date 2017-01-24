const toolbox = require("./node_modules/devtools-launchpad/index");
const getConfig = require("./bin/getConfig");

const path = require("path");
const projectPath = path.join(__dirname, "src");

/*
 * builds a path that's relative to the project path
 * returns an array so that we can prepend
 * hot-module-reloading in local development
 */
function getEntry(filename) {
  return [path.join(projectPath, filename)];
}

function buildConfig(envConfig) {
  const webpackConfig = {
    entry: {
      debugger: getEntry("main.js"),
      "source-map-worker": getEntry("utils/source-map-worker.js"),
      "pretty-print-worker": getEntry("utils/pretty-print-worker.js"),
      "integration-tests": getEntry("test/integration/tests.js"),
    },

    output: {
      path: path.join(__dirname, "assets/build"),
      filename: "[name].js",
      publicPath: "/assets/build",
      library: "Debugger"
    },

    resolve: {
      alias: {
        "react-dom": "react-dom/dist/react-dom",
        "devtools/client/shared/vendor/react": "react",
        "devtools/client/shared/vendor/react-dom": "react-dom",
      }
    },

    // Used by launchpad webpack.config.devtools, devtoolsRequire is the method available
    // to the debugger to load externals when loaded in a firefox panel.
    externalsRequire: "devtoolsRequire"
  };

  return toolbox.toolboxConfig(webpackConfig, envConfig);
}

const envConfig = getConfig();

module.exports = buildConfig(envConfig);
