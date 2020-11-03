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
		"no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsFor": ["state", "appointment", "r"] }],

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
		"react/jsx-props-no-spreading": "warn",

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
		'react/jsx-boolean-value': 1,//Enforce boolean attributes notation in JSX
		'react/jsx-indent': ['error', 'tab'],
		'react/jsx-indent-props': ['error', 'tab'],
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		"@typescript-eslint/no-use-before-define": ["error", { "functions": false, "classes": false, "variables": true }],
		'implicit-arrow-linebreak': 'off',
		'import/first': 'off',
		'import/no-extraneous-dependencies': 'warn',
		'@typescript-eslint/no-unused-vars': 'warn',
		'import/no-unresolved': [2, { ignore: ['^@zextras/zapp-ui'] } ],
		'no-extra-semi': 'off'
	},
	"overrides": [
		{ // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
			// enable the rule specifically for TypeScript files
			"files": ["*.ts", "*.tsx"],
			"rules": {
				"@typescript-eslint/explicit-function-return-type": ["error"]
			}
		}
	],
	'globals': {
		"FLAVOR": "readonly",
		"PACKAGE_NAME": "readonly",
		"PACKAGE_VERSION": "readonly",
		"e2e": "readonly",
		"cliSettings": "readonly",
	}
};
