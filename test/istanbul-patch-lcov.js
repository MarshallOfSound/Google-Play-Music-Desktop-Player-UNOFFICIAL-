const fs = require('fs');
const path = require('path');


const lcov = fs.readFileSync(path.resolve(__dirname, '..', 'coverage', 'lcov.info'), 'utf8');
const sep = process.platform === 'win32' ? '\\' : '/';
console.log(lcov.replace(/SF:/g, `SF:src${sep}`));
