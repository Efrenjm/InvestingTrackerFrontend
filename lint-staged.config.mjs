export default {
  '**/*.{ts,html,mjs}': 'eslint --max-warnings=0 --no-warn-ignored',
  // Validate tooling when its contract changes, without linting unrelated app debt.
  '{eslint.config.mjs,lint-staged.config.mjs,tsconfig*.json,package.json,package-lock.json,tools/**,.husky/pre-commit}': () => 'npm run test:lint',
  // This build is required by the shared-UI contract, but not for ordinary docs.
  '{src/app/shared/**,src/app/shell/**,**/*.stories.{ts,js,jsx,mjs,tsx},**/*.mdx,.storybook/**,angular.json,src/styles.css,src/material-theme.scss,.postcssrc.json}': () => 'npm run check:storybook',
};
