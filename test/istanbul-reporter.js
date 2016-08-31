const istanbulAPI = require('istanbul-api');
const libCoverage = require('istanbul-lib-coverage');
const Spec = require('mocha/lib/reporters/spec');

module.exports = class Istanbul extends Spec {
  constructor(runner) {
    super(runner);

    runner.on('end', () => {
      const mainReporter = istanbulAPI.createReporter();
      const coverageMap = libCoverage.createCoverageMap();

      coverageMap.merge(global.__coverage__ || {});

      mainReporter.addAll(['text', 'html']);
      mainReporter.write(coverageMap, {});
    });
  }
};
