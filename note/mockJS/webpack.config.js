const path = require("path");
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
    entry: './main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, './dist')
    },
	module: {
		rules: [
			{
				test: /\.css$/	,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.vue$/,
				use: 'vue-loader'
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	],
	mode: "production"
}
