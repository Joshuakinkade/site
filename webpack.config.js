module.exports = {
  mode: 'development',
  entry: {
    storyPlayground: './src/react/story-playground.js',
    albumPage: './src/react/album-page.js'
  },
  output: {
    path: __dirname + '/public/js/',
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    }]
  }
}