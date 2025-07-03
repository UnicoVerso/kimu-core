/**
 * This script removes the "kimu-build-config.ts" file located in the "src/config" directory.
 * It checks if the file exists and deletes it if found.
 * If the file does not exist, it logs a message indicating that there is nothing to remove.
 *
 * Key functionalities:
 * - Resolves the path to "kimu-build-config.ts" based on the script's location.
 * - Checks for the existence of the file.
 * - Deletes the file if it exists.
 * - Logs the result of the operation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current script file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the path to the "kimu-build-config.ts" file
const buildPath = path.resolve(__dirname, '../src/config/kimu-build-config.ts');

// Check if the file exists
if (fs.existsSync(buildPath)) {
  // Delete the file if it exists
  fs.unlinkSync(buildPath);
  console.log('[KIMU] 🧹 kimu-build-config.json removed');
} else {
  // Log a message if the file does not exist
  console.log('[KIMU] No file to remove');
}
