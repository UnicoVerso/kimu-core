/**
 * Utility module for fixing import paths in JavaScript files
 * by adding .js extensions to relative imports that don't have them.
 */
import fs from 'fs';
import path from 'path';

/**
 * Fix import paths in a JavaScript file
 * @param {string} filePath - Path to the JavaScript file to fix
 * @returns {boolean} - True if file was modified, false otherwise
 */
export function fixImportsInFile(filePath) {
  if (!fs.existsSync(filePath) || !filePath.endsWith('.js')) {
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Replace relative imports without .js extension
  const fixedContent = content
    .replace(/from\s*["']([\.\/][^"']*?)["']/g, (match, path) => {
      if (!path.includes('.js') && !path.includes('.json')) {
        return match.replace(path, path + '.js');
      }
      return match;
    })
    .replace(/import\s*\(\s*["']([\.\/][^"']*?)["']\s*\)/g, (match, path) => {
      if (!path.includes('.js') && !path.includes('.json')) {
        return match.replace(path, path + '.js');
      }
      return match;
    });
  
  if (content !== fixedContent) {
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    return true;
  }
  return false;
}

/**
 * Process all JavaScript files in a directory recursively
 * @param {string} dir - Directory to process
 * @returns {number} - Number of files fixed
 */
export function fixImportsInDirectory(dir) {
  if (!fs.existsSync(dir)) {
    return 0;
  }
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  let fixedCount = 0;
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      fixedCount += fixImportsInDirectory(fullPath);
    } else if (item.isFile() && item.name.endsWith('.js')) {
      if (fixImportsInFile(fullPath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

/**
 * Fix imports in multiple files
 * @param {string[]} filePaths - Array of file paths to fix
 * @returns {number} - Number of files fixed
 */
export function fixImportsInFiles(filePaths) {
  let fixedCount = 0;
  
  for (const filePath of filePaths) {
    if (fixImportsInFile(filePath)) {
      fixedCount++;
    }
  }
  
  return fixedCount;
}
