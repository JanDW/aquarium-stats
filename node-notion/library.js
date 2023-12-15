const fs = require('fs');

/**
 * Reads a JSON file and returns the parsed data.
 *
 * @param {string} filePath - The path to the JSON file.
 * @returns {Object|null} The parsed JSON data as a JavaScript object, or null if an error occurred.
 */

function readJson(filePath) {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(jsonData);
    return parsedData;
  } catch (error) {
    console.error('Error reading or parsing JSON:', error);
    return null;
  }
}

/**
 * Writes data to a JSON file.
 *
 * @param {string} filePath - The path to the JSON file.
 * @param {Object} data - The data to write to the file.
 */

function writeJson(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf-8');
    console.log('Data has been written to', filePath);
  } catch (error) {
    console.error('Error writing JSON to file:', error);
  }
}

module.exports = { readJson, writeJson };