import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import template from '@angular-eslint/eslint-plugin-template';
import templateParser from '@angular-eslint/template-parser';
import rxjs from 'eslint-plugin-rxjs-x';
import rxjsAngular from 'eslint-plugin-rxjs-angular-x';

export default defineConfig(
  {
    ignores: ['node_modules/**', 'dist/**', 'out-tsc/**', '.angular/**', 'coverage/**', 'storybook-static/**', 'documentation.json', '.docs/**', '.husky/_/**'],
    linterOptions: { reportUnusedDisableDirectives: 'error' },
  },
  {
    files: ['**/*.mjs'],
    extends: [js.configs.recommended],
  },
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { '@angular-eslint': angular, 'rxjs-x': rxjs, 'rxjs-angular-x': rxjsAngular },
    processor: template.processors['extract-inline-html'],
    rules: {
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/contextual-lifecycle': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      'rxjs-angular-x/prefer-takeuntil': ['error', {
        alias: ['takeUntilDestroyed'],
        checkDecorators: ['Component', 'Directive', 'Injectable', 'Pipe'],
        checkDestroy: false,
      }],
      'rxjs-x/no-unsafe-takeuntil': ['error', { alias: ['takeUntilDestroyed'] }],
      'rxjs-x/no-nested-subscribe': 'error',
      'rxjs-x/no-async-subscribe': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-restricted-imports': ['error', { paths: [{
        name: '@angular/forms',
        importNames: ['UntypedFormBuilder', 'UntypedFormGroup', 'UntypedFormControl', 'UntypedFormArray'],
        message: 'Use typed reactive forms.',
      }] }],
      'no-restricted-syntax': ['error',
        {
          selector: 'Decorator[expression.callee.name=/^(Component|Directive|Pipe)$/] Property[key.name="standalone"][value.value=true]',
          message: 'Standalone is the Angular default; omit standalone: true.',
        },
        {
          selector: 'CallExpression[callee.property.name=/^bypassSecurityTrust/]',
          message: 'Sanitization bypass requires explicit security review and a scoped documented exception.',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: { parser: templateParser },
    plugins: { '@angular-eslint/template': template },
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/interactive-supports-focus': 'error',
      '@angular-eslint/template/label-has-associated-control': 'error',
      '@angular-eslint/template/mouse-events-have-key-events': 'error',
      '@angular-eslint/template/no-distracting-elements': 'error',
      '@angular-eslint/template/elements-content': 'error',
      '@angular-eslint/template/role-has-required-aria': 'error',
      '@angular-eslint/template/table-scope': 'error',
      '@angular-eslint/template/valid-aria': 'error',
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-class-binding': 'error',
      '@angular-eslint/template/prefer-style-binding': 'error',
      '@angular-eslint/template/no-positive-tabindex': 'error',
      '@angular-eslint/template/no-autofocus': 'error',
      '@angular-eslint/template/no-outerhtml': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
);
