import antfu from '@antfu/eslint-config'
import disableAutofix from 'eslint-plugin-disable-autofix'
import eslintPluginReadableTailwind from 'eslint-plugin-readable-tailwind'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tailwindcss from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    type: 'app',
    stylistic: {
      overrides: {
        'style/max-len': ['error', { code: 80 }],
        'style/padded-blocks': ['error', 'never'],
        'style/padding-line-between-statements': 'error',
        'style/lines-between-class-members': ['error', {
          enforce: [
            { blankLine: 'always', prev: '*', next: '*' },
            { blankLine: 'never', prev: 'field', next: 'field' },
          ],
        }],
      },
    },
    test: {
      overrides: {
        'test/prefer-lowercase-title': ['error', {
          ignoreTopLevelDescribe: true,
        }],
      },
    },
    typescript: {
      overrides: {
        'ts/no-redeclare': 'off', // handled by typescript
      },
    },
    formatters: true,
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': ['error', {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Node.js builtins prefixed with `node:`.
          ['^node:'],
          // Packages.
          // Things that start with a letter (or digit or underscore),
          // or `@` followed by a letter.
          ['^@?\\w'],
          // Vue Components Import
          ['\\.vue$', '^@/components/ui/'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
        ],
      }],
      'simple-import-sort/exports': 'error',
      'perfectionist/sort-imports': 'off',
    },
  },
  ...tailwindcss.configs['flat/recommended'],
  {
    plugins: {
      'readable-tailwind': eslintPluginReadableTailwind,
    },
    rules: {
      ...eslintPluginReadableTailwind.configs.warning.rules,
      ...eslintPluginReadableTailwind.configs.error.rules,
      'readable-tailwind/multiline': ['error', {
        group: 'newLine',
      }],
    },
  },
  {
    plugins: {
      'disable-autofix': disableAutofix,
    },
    rules: {
      'vue/html-self-closing': 'off',
      'disable-autofix/vue/html-self-closing': 'warn',
    },
  },
  {
    ignores: ['src/clients/**/*'],
  },
)
