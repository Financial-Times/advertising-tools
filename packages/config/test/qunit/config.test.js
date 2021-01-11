/* globals QUnit: false */

'use strict'; //eslint-disable-line

import { fixturesContainer } from '../qunit/helpers'
import utils from '../../src/utils'
import config, { init, clear } from '../../src'

QUnit.module('config')

config.init = init
config.clear = clear

QUnit.test('Config get/set', function(assert) {
	config.init();
	config.clear();
	let result;
	const key = 'key';
	const key2 = 'key2';
	const invalid = 'invalid';
	const value = 'value';
	const value2 = 'value2';

	assert.ok(utils.isFunction(config), 'The set method exists');

	result = config(key, value);
	assert.deepEqual(result, value, 'passing a key+value returns the value.');

	result = config();
	const obj = {};
	obj[key] = value;
	assert.deepEqual(result, obj, 'calling without params returns all config.');

	result = config(key);
	assert.deepEqual(result, value, 'passing a valid key returns the value.');

	result = config(invalid);
	assert.deepEqual(result, undefined, 'passing an invalid key returns undefined.');

	result = config(key, value2);
	assert.deepEqual(result, value2, 'set an existing key returns the new value.');

	result = config(key);
	assert.deepEqual(result, value2, 'get returns the new value.');

	config(key, value2);
	config(key2, value2);
	result = config();
	assert.ok(result[key], 'configuration has got first key set');
	assert.ok(result[key2], 'configuration has got second key set');
	config.clear(key);
	result = config();
	assert.notOk(result[key], 'first key has been removed');
	assert.ok(result[key2], 'second key is still set');
});

QUnit.test('Config get/set - mulitple', function(assert) {
	config.init(true);
	config.clear();
	const obj = {
		'some': 'config',
		'parameters': 'to',
		'be': 'added'
	};

	let result = config(obj);
	assert.deepEqual(result, obj, 'set multiple key/values using an object.');

	result = config();
	assert.deepEqual(result, obj, 'get returns the new values.');
});

QUnit.test('Config defaults', function(assert) {
	init();
	const flags = {
		refresh: true,
		inview: true
	};
	const result = config();
	assert.ok(result.hasOwnProperty('flags'), 'default properties have been added to config');
	assert.deepEqual(config('flags'), flags, 'Config returns the correct value');
});

QUnit.test('Config fetchDeclaritive', function(assert) {
	const save = window.JSON;
	fixturesContainer.get().insertAdjacentHTML('beforeend', '<script data-o-ads-config type="application/json">{"dfpsite" : "site.site","dfpzone" : "zone.zone"}</script>');
	init();
	let result = config();
	assert.ok(result.dfpzone, 'Config has been fetched from the inline declarative script');


	window['JSON'] = undefined;
	init();
	result = config();
	assert.notOk(result.dfpsite, 'no DFP Site - when JSON not available the declarative config is not parsed');
	assert.notOk(result.dfpzone, 'no DFP zone - when JSON not available the declarative config is not parsed');
	window['JSON'] = save;
});

QUnit.test('Config fetchDeclaritive, multiple script tags', function(assert) {
	fixturesContainer.get().insertAdjacentHTML('beforeend', '<script data-o-ads-config type="application/json">{"athing" : "thing", "anotherthing" : "another"}</script>');
	fixturesContainer.get().insertAdjacentHTML('beforeend', '<script data-o-ads-config type="application/json">{"more" : "evenmore"}</script>');
	init();
	const result = config();
	assert.equal(result.athing, 'thing', 'data-o-ads-size attribute');
	assert.equal(result.more, 'evenmore', 'data-o-ads-size attribute');
});

QUnit.test('Config deep extends so default options like formats aren\'t overwritten', function(assert) {
	init();
	const result = config({formats: { someNewFormat: { sizes: [[2, 2]]}}});
	assert.ok(result.formats.HalfPage, 'predefined formats still exist');
	assert.ok(result.formats.someNewFormat, 'new format is added');
});

QUnit.test('Config works as expected even when there are custom prototype methods defined (e.g. polyfill)', function(assert) {
	// define a custom prototype method
	Array.prototype.customTestFunction = function () {}; // eslint-disable-line no-extend-native
	init();
	const flags = {
		refresh: true,
		inview: true
	};
	const repsonsiveDefaults = {
		extra: [1025, 0],
		large: [1000, 0],
		medium: [760, 0],
		small: [0, 0]
	};
	const result = config();
	assert.ok(result.hasOwnProperty('flags'), 'default properties have been added to config');
	assert.deepEqual(config('flags'), flags, 'Config returns the correct value');
	assert.deepEqual(config('responsive'), repsonsiveDefaults, 'Config returns the correct values for responsive slots');

	delete Array.prototype.customTestFunction;

});
