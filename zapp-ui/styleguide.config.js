const path = require('path');

module.exports = {
	assetsDir: ['docs/asset'],
	styleguideComponents: {
		Wrapper: path.resolve('./lib/styleguide/Wrapper'),
		Logo: path.resolve('./lib/styleguide/Logo')
	},
	sections: [
		{
			name: 'Introduction',
			content: 'docs/introduction.md'
		},
		{
			name: 'Getting Started',
			content: 'docs/getting-started.md'
		},
		{
			name: 'Components',
			sections: [
				{
					name: 'Basic',
					components: 'src/components/basic/**/*.jsx',
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
				},
				{
					name: 'Layout',
					components: 'src/components/layout/**/*.jsx',
					exampleMode: 'collapse',
					usageMode: 'expand',
				},
				{
					name: 'Inputs',
					components: 'src/components/inputs/**/*.jsx',
					exampleMode: 'collapse',
					usageMode: 'expand',
				},
				{
					name: 'Navigation',
					components: 'src/components/navigation/**/*.jsx',
					exampleMode: 'collapse',
					usageMode: 'expand',
				},
				{
					name: 'Data display',
					components: 'src/components/display/**/*.jsx',
					exampleMode: 'collapse',
					usageMode: 'expand',
				},
				{
					name: 'Feedback',
					components: 'src/components/feedback/**/*.jsx',
					exampleMode: 'collapse',
					usageMode: 'expand',
				},
				{
					name: 'Utilities',
					components: 'src/components/utilities/**/*.jsx',
					exampleMode: 'collapse',
					usageMode: 'expand',
				},
				{
					name: 'Composites',
					components: 'src/components/composite/**/*.jsx',
					exampleMode: 'collapse',
					usageMode: 'expand',
				}
			],
			sectionDepth: 2
		},
		{
			name: 'Documentation',
			sections: [
				{
					name: 'HSL',
					content: 'docs/HSL-Colors.md',
				},
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
