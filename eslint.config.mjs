import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';


export default [
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    eslintConfigPrettier,
    {
        ignores: ['node_modules/*', 'dist/*', 'data/*'],
        rules: {
            
        }
    },
];
