import glob from 'glob';
import path from 'path';

const uiPath = path.resolve(__dirname, '..', '..', 'build', 'renderer', 'ui', '**', '*.js');
// Get 0% coverage for all UI components before starting
glob.sync(uiPath).forEach((filePath) => { require(filePath); });
