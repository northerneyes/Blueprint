var dest = './dist';
var src = './app';

module.exports = {
	dist: dest,
	devMode: true,
	vendor_styles: [],
	browserSync: {
		open: false,
		port: 8080,
		server: {
			baseDir: dest
		}
	},
	browserify: {
		bundleConfigs: [{
			dest: dest,
			sourcemap: false,
			outputName: 'vendor.js',
			require: ['jquery', 'lodash', 'backbone', 'react', 'flux', 'd3', 'react-d3']
		}, {
			entries: src + '/index.js',
			sourcemap: true,
			dest: dest,
			outputName: 'app.js',
			// list of externally available modules to exclude from the bundle
			external: ['jquery', 'lodash', 'backbone', 'react', 'flux', 'd3', 'react-d3']
		}]
	},
	src_css: "app/assets/css/**/*.css",
	src_views: './app/**/*.html',
	src_scripts: './app/**/*.js',

	dest_css: './dist/assets/css/'
};