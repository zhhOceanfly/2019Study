const path = require("path");
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
    entry: './webapp/App.js',
    output: {
        filename: 'App.js',
        path: path.resolve(__dirname, './dist')
    },
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
            {
                test: /\.scss/,
                use: ['style-loader', 'css-loader','sass-loader']
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
