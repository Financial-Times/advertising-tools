/**
 * Utility methods for the advertising library.
 * @author Origami Advertising, origami.advertising@ft.com
 * @module utils
 */
const hop = Object.prototype.hasOwnProperty;

/**
 * Uses object prototype toString method to get at the type of object we are dealing,
 * IE returns [object Object] for null and undefined so we need to filter those
 * http://es5.github.com/#x15.2.4.2
 * @private
 * @param {object} Any javascript object
 * @returns The type of the object e.g Array, String, Object
 */
function is(object) {
	const type = Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];

	if (object === null) {
		return 'Null';
	} else if (object === undefined) {
		return 'Undefined';
	} else {
		return type;
	}
}

/**
 * Test if an object is an Array
 * @param {object} obj The object to be tested
 * @returns {boolean} true if the object is of type Array, otherwise false
 */
export const isArray = function (obj) {
	return is(obj) === 'Array';
};

/**
 * Test if an object is a Function
 * @param {object} obj The object to be tested
 * @returns {boolean} true if the object is of type Function, otherwise false
 */
export const isFunction = function (obj) {
	return is(obj) === 'Function';
};

/**
 * Test if an object is an Object
 * @param {object} obj The object to be tested
 * @returns {boolean} true if the object is of type Object, otherwise false
 */
export const isObject = function (obj) {
	return is(obj) === 'Object';
};

/**
 * Test if an object is the global window object
 * @param {object} obj The object to be tested
 * @returns {boolean} true if the object is the window obj, otherwise false
 */
export const isWindow = function (obj) {
	return obj && obj !== null && obj === window;
};

/**
 * Test if an object inherits from any other objects, used in extend
 * to protect against deep copies running out of memory and constructors
 * losing there prototypes when cloned
 * @param {object} obj The object to be tested
 * @returns {boolean} true if the object is plain false otherwise
 */
export const isPlainObject = function (obj) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if (!obj || !isObject(obj) || obj.nodeType || isWindow(obj)) {
		return false;
	}

	try {
		// Not own constructor property must be Object
		if (obj.constructor && !hop.call(obj, 'constructor') && !hop.call(obj.constructor.prototype, 'isPrototypeOf')) {
			return false;
		}
	} catch (e) {
		/* istanbul ignore next  */
		// IE8,9 Will throw exceptions on certain host objects
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	let key;
	for (key in obj) {
		// empty
	}

	return key === undefined || hop.call(obj, key);
};

export function extend() {
	/* jshint forin: false */
	/* when doing a deep copy we want to copy prototype properties */
	let options;
	let src;
	let copy;
	let copyIsArray;
	let clone;
	let target = arguments[0] || {};
	const length = arguments.length;
	let deep = false;
	let i = 1;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};

		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	/* istanbul ignore else  */
	if (typeof target !== 'object' && !isFunction(target)) {
		target = {};
	}

	// do nothing if only one argument is passed (or 2 for a deep copy)
	/* istanbul ignore else  */
	if (length === i) {
		return target;
	}

	for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) !== null) {
			// Extend the base object
			for (const name in options) {
				/* istanbul ignore next */
				if (options.hasOwnProperty(name)) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging arrays
					if (deep && copy && (isPlainObject(copy) || isArray(copy))) {
						copyIsArray = isArray(copy);
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
}

export default {
	isArray,
	isFunction,
	isObject,
	isWindow,
	isPlainObject,
	extend,
};
