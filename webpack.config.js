const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

function generateHtmlPlugins(templateDir) {
	const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
	return templateFiles.map(item => {
		const parts = item.split('.');
		const name = parts[0];
		const extension = parts[1];
		return new HtmlWebpackPlugin({
			filename: `${name}.html`,
			template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
			inject: false,
		})
	})
}

const htmlPlugins = generateHtmlPlugins('./src/template/views');

let conf = {
	entry: [
		'./src/js/index.js',
		'./src/scss/style.scss'
	],
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: './js/bundle.js',
		publicPath: 'dist/'
	},
	devServer: {
		overlay: true
	},
	devtool: "source-map",
	module: {
		rules: [{
			test: /\.js$/,
			include: path.resolve(__dirname, 'src/js'),
			use: {
				loader: 'babel-loader',
				options: {
					presets: [
						['@babel/preset-env', {
							modules: false
						}],
					],
					plugins: ['@babel/plugin-proposal-class-properties'],
				}
			}
		},
			{
				test: /\.(sass|scss)$/,
				include: path.resolve(__dirname, 'src/scss'),
				use: [{
					loader: MiniCssExtractPlugin.loader,
					options: {}
				},
					{
						loader: "css-loader",
						options: {
							sourceMap: true,
							url: false
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							sourceMap: true,
							plugins: () => [
								require('cssnano')({
									preset: ['default', {
										discardComments: {
											removeAll: true,
										},
									}]
								})
							]
						}
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.html$/,
				include: path.resolve(__dirname, 'src/template/includes'),
				use: ['raw-loader']
			},

		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "./css/style.min.css"
		}),
		new CopyWebpackPlugin([{
			from: './src/fonts',
			to: './fonts'
		},
			{
				from: './src/img',
				to: './img'
			}
		])
	].concat(htmlPlugins)
};

module.exports = (env, options) => {
	let production = options.mode === 'production';
	// conf.devtool = production ? false : 'eval-sourcemap';
	conf.devtool = production ? 'eval-sourcemap' : 'eval-sourcemap';
	return conf;
};