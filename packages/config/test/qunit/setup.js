/* global QUnit: false */

'use strict'; //eslint-disable-line

QUnit.config.testTimeout = 5000;
QUnit.config.urlConfig.push({
	id: 'DEBUG',
	value: 'ADS-CONFIG',
	label: 'Debug Mode',
	tooltip: 'Show debug log messages'
});

// change the karma debug page title to something more fitting
document.querySelector('title').innerHTML = 'ads-config unit tests';


// Show the qunit ui only when viewing the karma debug page
if (window.top === window) {
	document.body.insertAdjacentHTML('afterbegin', '<div id="qunit"></div>');
}

// div for attaching HTML fixtures, will be emptied after each test
document.body.insertAdjacentHTML('afterbegin', '<div id="qunit-fixtures"></div>');
