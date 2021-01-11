/* eslint no-console: 0 */

'use strict'; //eslint-disable-line

const rollupConfig = require('./rollup.config');
console.log('ROO', rollupConfig)

// if you want a different local configuration create a file called karma.local.js
// the file should export a function that takes the current options object and
// returns an amended one e.g.
// module.exports = function (options) {
// 	var options.test = "it works!";
// 	return options;
// }

let options = {
	basePath: '',
	autoWatch: true,
	singleRun: false,
	frameworks: ['qunit'],
	files: [
		'test/qunit/setup.js',
		'test/qunit/*.test.js',
	],
	preprocessors: {
		'test/qunit/setup.js': ['rollup'],
		'test/qunit/*.test.js': ['rollup']
	},
	rollupPreprocessor: {
		options: rollupConfig[0]
	},
	customLaunchers: {
		Chrome_with_flags: {
			base: 'Chrome',
			flags: ['--disable-web-security', '--no-sandbox', '--no-first-run']
		}
	},
	browsers: ['Chrome_with_flags'],
	reporters: ['progress'],
};

// In the CI environment set an environment variable CI = 'true'
if (process.env.CI === 'true') {
	console.log('CI options activated');
	// CI options go here
	options.singleRun = true;
	options.autoWatch = false;
} else {
	//options for local go here
}

if (process.env.CIRCLECI) { } // eslint-disable-line no-empty

try {
	options = require('./karma.local.js')(options);
	console.log('Local config loaded');
} catch (err) {
	if (err.code === 'MODULE_NOT_FOUND') {
		console.log('No local config found');
	} else {
		console.error('%s:%s', err.code, err.toString().replace('Error:', ''));
	}
}

module.exports = function(config) {
	config.set(options);
};
