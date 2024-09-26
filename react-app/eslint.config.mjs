/** @format */

import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
				chrome: 'readonly', // Add this line to recognize 'chrome' globally
			},
		},
	},
	pluginJs.configs.recommended,
	pluginReact.configs.flat.recommended,
];
