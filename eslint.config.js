import antfu from '@antfu/eslint-config'
import eslintPluginReadableTailwind from 'eslint-plugin-readable-tailwind'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

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
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'perfectionist/sort-imports': 'off',
    },
  },
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
    ignores: ['src/clients/**/*'],
  },
)
