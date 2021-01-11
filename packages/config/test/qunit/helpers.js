'use strict'; //eslint-disable-line

/* container for fixtures */
export const fixturesContainer = {
	get: () => document.getElementById('qunit-fixtures'),
	add: (html) => {
		fixturesContainer.get().insertAdjacentHTML('beforeend', html);
		return fixturesContainer.get().lastChild;
	}
};

export default {
	fixturesContainer,
};