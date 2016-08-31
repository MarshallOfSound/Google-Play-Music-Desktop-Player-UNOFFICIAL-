const istanbulAPI = require('istanbul-api');
const libCoverage = require('istanbul-lib-coverage');

function Istanbul(runner) {
  runner.on('end', () => {
    const mainReporter = istanbulAPI.createReporter();
    const coverageMap = libCoverage.createCoverageMap();

    coverageMap.merge(global.__coverage__ || {});

    mainReporter.addAll(['text', 'html']);
    mainReporter.write(coverageMap, {});
  });
}


module.exports = Istanbul;
