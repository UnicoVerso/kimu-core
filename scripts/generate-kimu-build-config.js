/**
 * This script generates the "kimu-build-config.ts" file based on the base configuration,
 * environment-specific configuration, and the version from the project's package.json.
 * The generated file is saved in the "src/config" directory.
 *
 * Key functionalities:
 * - Reads the base configuration from "kimu-base-config.json".
 * - Reads the environment-specific configuration from "<env>.config.json".
 * - Extracts the version from "package.json".
 * - Combines the configurations and version into a single object.
 * - Generates a TypeScript file with the final configuration.
 * - Logs the success or failure of the operation.
 *
 * Usage:
 *   node generate-kimu-build-config.js <environment>
 * Example:
 *   node generate-kimu-build-config.js production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current script file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get the environment argument or default to "dev"
const env = process.argv[2] || 'dev';

// Import the package.json to retrieve the version
// Note: Importing package.json this way ensures compatibility with different paths
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));
const version = pkg.version || '0.0.0';

// Paths to configuration files
const configPath = path.resolve(__dirname, '../src/config/kimu-base-config.json');
const envConfigPath = path.resolve(__dirname, `../env/${env}.config.json`);
const outputPath = path.resolve(__dirname, '../src/config/kimu-build-config.ts');

// Check if the environment-specific configuration file exists
if (!fs.existsSync(envConfigPath)) {
  console.error(`[KIMU] ❌ Missing env config: ${envConfigPath}`);
  process.exit(1);
}

// Read and parse the base and environment-specific configurations
const base = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const build = JSON.parse(fs.readFileSync(envConfigPath, 'utf-8'));

// Override with environment variables if present
if (process.env.KIMU_BASE_PATH) {
  build['base-path'] = process.env.KIMU_BASE_PATH;
  console.log(`[KIMU] 🔧 Base path overridden from env: ${process.env.KIMU_BASE_PATH}`);
}
if (process.env.KIMU_API_URL) {
  build['api-url'] = process.env.KIMU_API_URL;
  console.log(`[KIMU] 🔧 API URL overridden from env: ${process.env.KIMU_API_URL}`);
}
if (process.env.KIMU_WEB_URL) {
  build['web-url'] = process.env.KIMU_WEB_URL;
  console.log(`[KIMU] 🔧 Web URL overridden from env: ${process.env.KIMU_WEB_URL}`);
}

// Combine the configurations, version, and environment into the final object
const finalConfig = {
  ...base,
  version,
  environment: env,
  build
};

// Generate the TypeScript content for the configuration file
const tsContent = `/** Automatically generated file. Do not modify. */
export const KimuBuildConfig = ${JSON.stringify(finalConfig, null, 2)} as const;
`;

// Write the generated content to the output file
fs.writeFileSync(outputPath, tsContent);
console.log(`[KIMU] ✅ Generated kimu-build-config.ts for "${env}" → version ${version}`);
