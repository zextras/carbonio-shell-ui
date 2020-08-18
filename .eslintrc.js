module.exports = {
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"project": "./tsconfig.json",
		"tsconfigRootDir": "."
	},
	"env": {
		"browser": true,
		"jest/globals": true
	},
	"plugins": [
		"@typescript-eslint/eslint-plugin",
		"react",
		"react-hooks",
		"jest"
	],
	"extends": [
		"airbnb",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/typescript",
	],
	"rules": {
		/**
		 * @description rules of eslint official
		 */
		/**
		 * @bug https://github.com/benmosher/eslint-plugin-import/issues/1282
		 * "import/named" temporary disable.                                      //not temporary
		 */
		"import/named": "off",
		/**
		 * @bug?
		 * "import/export" temporary disable.
		 */
		"import/export": "off",
		"import/prefer-default-export": "off", // Allow single Named-export
		"no-unused-expressions": ["warn", {
			"allowShortCircuit": true,
			"allowTernary": true
		}], // https://eslint.org/docs/rules/no-unused-expressions

		/**
		 * @description rules of @typescript-eslint
		 */
		"@typescript-eslint/prefer-interface": "off", // also want to use "type"
		//"@typescript-eslint/explicit-function-return-type": "off", // annoying to force return type

		/**
		 * @description rules of eslint-plugin-react
		 */
		"react/jsx-filename-extension": ["warn", {
			"extensions": [".jsx", ".tsx"]
		}], // also want to use with ".tsx"
		"react/prop-types": "off", // Is this incompatible with TS props type?

		/**
		 * @description rules of eslint-plugin-react-hooks
		 */
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",
		'no-tabs': 'off',
		'indent': ['error', 'tab', { 'SwitchCase': 1 }],
		'comma-dangle': 'off',
		'no-underscore-dangle': 'off',
		'brace-style': ['error', 'stroustrup'],
		/**
		 * @description rule of eslint-plugin-react
		 */
		'react/jsx-boolean-value': 'always', //Enforce boolean attributes notation in JSX
		'react/jsx-indent': ['error', 'tab'],
		'react/jsx-indent-props': ['error', 'tab'],
		'@typescript-eslint/interface-name-prefix': 'off',
		'implicit-arrow-linebreak': 'off',
		'import/no-extraneous-dependencies': 'warn',
		'@typescript-eslint/no-unused-vars': 'warn',
		'import/no-unresolved': [2, { ignore: ['^@zextras/zapp-shell/(context|fc|idb|network|router|service|sync)'] }],
		'no-extra-semi': 'off'
	},

};
