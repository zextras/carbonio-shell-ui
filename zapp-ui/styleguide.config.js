const path = require('path');

module.exports = {
	assetsDir: ['docs/asset'],
	styleguideComponents: {
		Wrapper: path.resolve('./lib/styleguide/Wrapper')
	},
	sections: [
		{
			name: 'Introduction',
			content: 'docs/introduction.md'
		},
		{
			name: 'Components',
			sections: [
				{
					name: 'Primitives',
					components: 'src/components/primitive/**/*.jsx',
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
				},
				{
					name: 'Utilities',
					components: 'src/components/utilities/**/*.jsx',
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
				},
				{
					name: 'Composites',
					components: 'src/components/composite/**/*.jsx',
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
				}
			],
			sectionDepth: 2
		},
		{
			name: 'Documentation',
			sections: [
				{
					name: 'Theming',
					content: 'docs/theming.md',
				},
				{
					name: 'Default Theme',
					content: 'docs/default-theme.md',
				},
				{
					name: 'Icons',
					content: 'docs/icons.md',
				}
			],
			sectionDepth: 2
		},
		{
			name: 'Playground',
			content: 'docs/playground.md',
			exampleMode: 'expand',
		}
	],
	pagePerSection: true,
	theme: {
		color: {

		}
	}
};
