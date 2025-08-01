import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**', '**/out/**'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Base rules
      ...js.configs.recommended.rules,
      
      // Disable problematic rules
      'no-useless-catch': 'off',
      'no-unused-vars': 'off',
      'react/display-name': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-empty': 'off',
      'no-undef': 'off',
      'no-console': 'warn',
      'no-debugger': 'warn',
      
      // React specific rules
      'react/prop-types': 'off',
      'react/jsx-filename-extension': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/forbid-prop-types': 'off',
      'react/no-array-index-key': 'off',
      'react/static-property-placement': 'off',
      'react/state-in-constructor': 'off',
      'react/jsx-no-bind': 'off',
      'react/jsx-no-constructed-context-values': 'off',
      'react/no-unstable-nested-components': 'off',
      
      // JSX a11y rules
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      
      // Other rules
      'no-underscore-dangle': 'off',
      'no-param-reassign': 'off',
      'no-nested-ternary': 'off',
      'no-alert': 'off',
      'no-plusplus': 'off',
      'no-shadow': 'off',
      'consistent-return': 'off',
      'prefer-const': 'warn',
      'prefer-template': 'warn',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-cycle': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },
];
