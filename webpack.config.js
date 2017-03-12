var path = require('path'); // gets the directory path for the file
var webpack = require('webpack'); //to get built in plugins
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // plugin used to extract css into a seperate file during production instead of injecting into head tag
var HTMLWebpackPlugin = require('html-webpack-plugin'); // to auto-generate index.html file to facilitate the use of hash coded names of js & css production files

var DEVELOPMENT = process.env.NODE_ENV === 'development';
var PRODUCTION = process.env.NODE_ENV === 'production';
// Checking for development/production mode using NODE_ENV (node environment) variables

var entry = PRODUCTION
?   [ './src/index.js' ]
:   [ './src/index.js',
'webpack/hot/dev-server',
'webpack-dev-server/client?http://localhost:8080'
]; // If prod -> only index, else in dev -> HMR (Hot Module Replacement)

var plugins = PRODUCTION
?   [
      new webpack.optimize.UglifyJsPlugin(),
      new ExtractTextPlugin( 'style-[contenthash:10].css' ),
      // providing filename inside ExtractTextPlugin
      // hash-coding helps in browser caching of the files => load-time boost
      // Read https://webpack.js.org/guides/caching/#components/sidebar/sidebar.jsx to better understand the use of  hash coded names
      new HTMLWebpackPlugin({
        template: 'index-template.html' // default template
      })
    ]
:   [ new webpack.HotModuleReplacementPlugin() ];
// Uglify in production, HMR otherwise

plugins.push (
  new webpack.DefinePlugin ({
    DEVELOPMENT: JSON.stringify(DEVELOPMENT),
    PRODUCTION: JSON.stringify(PRODUCTION)
  })
); // stringify and export boolean values of DEVELOPMENT/PRODUCTION variables

const cssIdentifier = PRODUCTION ? '[hash:base64:10]' : '[path][name]---[local]';
//in production, use hash code with 10 letters, else use the given name during dev

const cssLoader = PRODUCTION
?   ExtractTextPlugin.extract({
  use: 'css-loader?localIdentName=' + cssIdentifier
})
:   ['style-loader', 'css-loader?localIdentName=' + cssIdentifier]; // sequence of loaders matter
// CSS loader parses CSS
// Style loader injects css directly into the head tag which is useful during development but undesirable during production

//
//
//

//MAIN CONFIGURATION CODE
const config = {
  externals: {
    'jquery': 'jQuery'
    // jquery is available at the global variable jQuery
    // it will not included in the final prod build - reduce size
    // used as a CDN, so remove npm installs
  },
  devtool: 'source-map',
  plugins: plugins,
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: PRODUCTION ? '/' : '/dist',
    filename: PRODUCTION ? 'bundle.[hash:12].min.js' : 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'], //to transpile es6 code into es5 code
      exclude: '/node_modules/' // to exclude node_modules (they're already transpiled)
    },
    {
      test: /\.(png|jpg|gif)$/,
      use: ['url-loader?limit=10000&name=images/[hash:12].[ext]'],
      //limit defines max file size for which it is applicable
      //name contains address + [hash:n].[ext] where n -> length of name & ext -> extension of img (jpg/gif/png)
      exclude: '/node_modules/'
    },
    {
      test: /\.css$/,
      use: cssLoader, //seuqence should be 'style-loader' then 'css-loader'
      exclude: '/node_modules/'
    }
  ]
}
}

module.exports = config;
