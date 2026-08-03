import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettier from "eslint-config-prettier/flat";

// eslint-config-prettier must come last so it can switch off the rules that
// would otherwise fight `npm run format` over spacing and line breaks.
export default withNuxt(eslintConfigPrettier);
