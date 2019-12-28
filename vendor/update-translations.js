const diff = require('diff');
const fs = require('fs');
const path = require('path');

const BASE_FILE = 'en-US.json';

function readLines(fileName) {
  return fs.readFileSync(fileName, 'utf8').split(/\r?\n/g);
}

function clearValues(lines) {
  return lines.map(x => x.replace(/([^:]+:\s*").*(".*)/, '$1$2'));
}

const dir = path.resolve(__dirname, '../src/_locales');
const baseLines = clearValues(readLines(path.resolve(dir, BASE_FILE)));

fs.readdirSync(dir).forEach((name) => {
  if ((path.extname(name) === '.json') && name !== BASE_FILE) {
    const filePath = path.resolve(dir, name);
    const lines = readLines(filePath);

    const result = [];
    let lineIndex = 0;

    // Create a diff between the base lines and the lines from this file with empty
    // values. This will tell us what has been added and removed from the base file.
    for (const change of diff.diffArrays(baseLines, clearValues(lines))) {
      if (change.added) {
        // Some lines are in the locale file that are not in the base file.
        // We can remove those lines from the locale file by skipping over them.
        lineIndex += change.count;
      } else if (change.removed) {
        // Some lines are in the base file that are not in the locale file.
        // The diff value contains the missing lines, so add those to the result.
        result.push(...change.value);
      } else {
        // Nothing has changed in this section, so add
        // the original lines from the locale file.
        result.push(...lines.slice(lineIndex, lineIndex + change.count));
        lineIndex += change.count;
      }
    }

    fs.writeFileSync(filePath, result.join('\n'));
  }
});
