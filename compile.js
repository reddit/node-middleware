var webpack = require("webpack");
var argv = require("yargs").argv;
var notifier = require("node-notifier");
var path = require("path");
var fs = require('fs');
var _ = require('lodash');

var SUB_MODULES = fs.readdirSync('lib/modules')
  .reduce(function(prev, modName) {
    var modules = _.extend({}, prev);
    modules[modName.replace('.js', '')] = './lib/modules/' + modName;
    return modules;
  }, {});

var SUB_MODULE_EXTERNALS = fs.readdirSync('lib/modules')
  .reduce(function(prev, modName) {
    var modules = _.extend({}, prev);
    modules['./modules/' + modName.replace('.js', '')] = './' + modName;
    return modules;
  }, {});

var compiler = webpack({
  entry: _.extend({
    middleware: './lib/middleware.js',
  }, SUB_MODULES),
  output: {
    path: path.join(__dirname),
    filename: "[name].js",
    library: "[name].js",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [
            // 'es2015',
            // 'stage-2',
            // 'react',
          ],
          plugins: [
            'check-es2015-constants',
            'transform-es2015-arrow-functions',
            'transform-es2015-block-scoped-functions',
            'transform-es2015-block-scoping',
            'transform-es2015-classes',
            'transform-es2015-computed-properties',
            'transform-es2015-destructuring',
            'transform-es2015-duplicate-keys',
            'transform-es2015-for-of',
            'transform-es2015-function-name',
            'transform-es2015-literals',
            'transform-es2015-modules-commonjs',
            'transform-es2015-object-super',
            'transform-es2015-parameters',
            'transform-es2015-shorthand-properties',
            'transform-es2015-spread',
            'transform-es2015-sticky-regex',
            'transform-es2015-template-literals',
            'transform-es2015-typeof-symbol',
            'transform-es2015-unicode-regex',
            // 'transform-runtime',
          ],
        },
      },
    ],
  },
  externals: _.extend({
    'lodash/object': 'commonjs lodash/object',
  }, SUB_MODULE_EXTERNALS),
});

function formatAsset(asset) {
  var name = asset.name;
  var size = asset.size;
  var sizeStr = size + " B";

  if (size > 1000) sizeStr = Math.ceil(size / 1000) + " kB";
  if (size > 1000000) sizeStr = Math.ceil(size / 1000000) + " MB";

  return name + " [" + sizeStr + "]";
}

if (argv.watch) {
  compiler.watch({}, (err, stats) => {
    if (!err) {
      console.log(stats.toString({
        colors: true,
        chunks: false,
        version: false,
      }));

      var s = stats.toJson();

      if (s.errors && s.errors.length) {
        notifier.notify({
          "title": "ERROR!",
          "message": "Check the console for errors",
        });
      } else {
        notifier.notify({
          "title": "Build complete",
          "message": s.assets.map(formatAsset).join("\n"),
        });
      }
    }
  });
} else {
  compiler.run(function(err, stats) {
    console.log(stats.toString({
      colors: false,
      chunks: false,
      version: false,
    }));
  });
}
