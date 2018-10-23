const fs = require('fs');
const path = require('path');

const locales = path.resolve(__dirname, '../src/_locales');

const targetLines = fs.readFileSync(path.resolve(locales, 'en-US.json'), 'utf8').split(/\r?\n/g);

const keyTest = () => /"(.+)":/gi;

const targetKeys = [];
for (let i = 0; i < targetLines.length; i++) {
  if (targetLines[i].trim() === '{' || targetLines[i].trim() === '}' || !targetLines[i].trim()) continue;
  targetKeys.push(keyTest().exec(targetLines[i])[1]);
}

fs.readdirSync(locales).forEach((fileName) => {
  const needToAdd = [];
  const filePath = path.resolve(locales, fileName);

  if (fileName.endsWith('.json') && fileName !== 'en-US.json') {
    const content = fs.readFileSync(filePath, 'utf8');

    let lines = content.split(/\r?\n/g);
    let keyI = 0;
    let offset = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '{' || lines[i].trim() === '}' || !lines[i].trim()) continue;
      const key = keyTest().exec(lines[i])[1];
      if (key !== targetKeys[keyI]) {
        needToAdd.push([i + offset, targetKeys[keyI]]);
        i--;
        offset++;
      }
      keyI++;
    }

    needToAdd.forEach((item) => {
      lines = lines.slice(0, item[0] - 1).concat([`  "${item[1]}": "",`]).concat(lines.slice(item[0] - 1, lines.length));
    });
    fs.writeFileSync(filePath, lines.join('\n'));
  }
});
