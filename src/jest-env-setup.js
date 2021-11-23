// import '@testing-library/jest-dom/extend-expect';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

Object.defineProperty(global.self, 'crypto', {
	value: {
		getRandomValues: (arr) => crypto.randomBytes(arr.length)
	}
});
