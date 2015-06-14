var dest = './dist';
var src = './app';

module.exports = {
	dist: dest,
	devMode: true,
	vendor_styles: [],
	browserSync: {
		open: false,
		server: {
			baseDir: dest
		}
	},
	browserify: {
		bundleConfigs: [{
			dest: dest,
			sourcemap: false,
			outputName: 'vendor.js',
			require: ['jquery', 'lodash', 'backbone', 'react', 'flux']
		}, {
			entries: src + '/',
			sourcemap: true,
			dest: dest,
			outputName: 'app.js',
			// list of externally available modules to exclude from the bundle
			external: ['jquery', 'lodash', 'backbone', 'react', 'flux']
		}]
	},
	src_css: "app/assets/css/**/*.css",
	src_views: './app/**/*.html',
	src_fonts: './app/assets/fonts/**/*',
	src_scripts: './app/**/*.js',
	dest_css: './dist/assets/css/',
	dest_scripts: './dist/assets/js/',
	dest_fonts: './dist/assets/fonts/'
};