const electron = require('electron');
const istanbulAPI = require('istanbul-api');
const libCoverage = require('istanbul-lib-coverage');
const Spec = require('mocha/lib/reporters/spec');
const remapIstanbul = require('remap-istanbul');
const fs = require('fs');
const path = require('path');

const isMain = !electron.remote;

module.exports = class Istanbul extends Spec {
  constructor(runner) {
    super(runner);

    runner.on('end', () => {
      const mainReporter = istanbulAPI.createReporter();
      const coverageMap = libCoverage.createCoverageMap();

      const JSONPath = path.resolve(__dirname, '..', 'coverage', 'coverage-final.json');
      const MainJSONPath = path.resolve(__dirname, '..', 'coverage', 'coverage-final-main.json');
      const RendererJSONPath = path.resolve(__dirname, '..', 'coverage', 'coverage-final-renderer.json');

      coverageMap.merge(global.__coverage__ || {});

      mainReporter.addAll(['json']);
      mainReporter.write(coverageMap, {});

      // node_modules\.bin\remap-istanbul -i coverage\coverage-final.json -o coverage\coverage-final.json -t json
      const JSONOutput = fs.readFileSync(JSONPath, 'utf8');
      const JSONObjectString = JSONOutput.replace(/"(.+?\.js)": /gi, (all, match) => `"${match.replace(/\\/g, '\\\\')}": `);
      const JSONObject = JSON.parse(JSONObjectString);
      Object.keys(JSONObject).forEach((JSONKey) => {
        if (/\/src\//g.test(JSONKey) || /\\src\\/g.test(JSONKey)) {
          delete JSONObject[JSONKey];
        }
      });
      fs.writeFileSync(isMain ? MainJSONPath : RendererJSONPath, JSON.stringify(JSONObject));

      const mergeCoverageMap = libCoverage.createCoverageMap();
      let rO = {};
      try {
        rO = JSON.parse(fs.readFileSync(RendererJSONPath, 'utf8'));
      } catch (e) {
        // Who cares
      }
      mergeCoverageMap.merge(rO);
      let mO = {};
      try {
        mO = JSON.parse(fs.readFileSync(MainJSONPath, 'utf8'));
      } catch (e) {
        // Who cares
      }
      mergeCoverageMap.merge(mO);
      fs.writeFileSync(JSONPath, JSON.stringify(mergeCoverageMap.toJSON()));

      remapIstanbul(isMain ? MainJSONPath : RendererJSONPath, {
        json: `${isMain ? MainJSONPath : RendererJSONPath}.remap`,
      }).then(() => {
        const RemappedJSON = JSON.parse(fs.readFileSync(`${isMain ? MainJSONPath : RendererJSONPath}.remap`, 'utf8'));

        Object.keys(RemappedJSON).forEach((JSONKey) => {
          const sep = process.platform === 'win32' ? '\\' : '/';
          RemappedJSON[JSONKey].path = `src${sep}${RemappedJSON[JSONKey].path}`;
          RemappedJSON[`src${sep}${JSONKey}`] = RemappedJSON[JSONKey];
          delete RemappedJSON[JSONKey];
        });

        const textReporter = istanbulAPI.createReporter();
        const fixedCoverageMap = libCoverage.createCoverageMap();

        fixedCoverageMap.merge(RemappedJSON);

        textReporter.addAll(['text-summary']);
        textReporter.write(fixedCoverageMap, {});
      });
    });
  }
};
