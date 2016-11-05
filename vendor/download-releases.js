const fetch = require('node-fetch');
const mkdirp = require('mkdirp');
const nugget = require('nugget');
const path = require('path');
const rimraf = require('rimraf');

const version = require('../package.json').version;
const downloadQueue = [];

const runQueue = () => {
  if (downloadQueue.length === 0) return;
  const nextTarget = downloadQueue.pop(0);
  const nuggetOpts = {
    dir: path.resolve(__dirname, '..', 'dist', 'installers', nextTarget.platform),
    resume: true,
    quiet: true,
  };
  console.log('Downloading:', nextTarget.what);
  rimraf(nuggetOpts.dir, () => {
    mkdirp(nuggetOpts.dir, () => {
      if (nextTarget.filename) {
        nuggetOpts.target = nextTarget.filename;
      }
      nugget(nextTarget.url, nuggetOpts, () => console.log('Finished Downloading:', nextTarget.what));
    });
  });
  runQueue();
};

console.log(`Fetching builds of GPMDP version ${version} from build agents...`);

const fail = (fn, platform, arch) => {
  if (arch) {
    console.error(`Failed to acquire ${platform}_${arch} build artifact, trying again in 30 seconds`);
  } else {
    console.error(`Failed to acquire ${platform} build artifact, trying again in 30 seconds`);
  }
  setTimeout(() => fn(arch), 30000);
  return Promise.reject();
};

const obtainDarwinBuild = () => {
  console.log('Searching for Darwin builds');
  fetch('https://api.travis-ci.org/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/builds', {
    headers: {
      Accept: 'application/vnd.travis-ci.2+json',
    },
  })
    .then(r => r.json())
    .then(({ builds, commits }) => {
      const targetCommit = commits.find(c => c.branch === `v${version}`);
      if (!targetCommit) {
        return fail(obtainDarwinBuild, 'darwin');
      }
      const targetBuild = builds.find(b => b.commit_id === targetCommit.id);
      if (!targetBuild.state === 'passed') {
        return fail(obtainDarwinBuild, 'darwin');
      }
      const targetJob = targetBuild.job_ids[0];
      if (!targetJob) {
        return fail(obtainDarwinBuild, 'darwin');
      }
      return fetch(`https://api.travis-ci.org/jobs/${targetJob}`);
    })
    .then(r => r.json())
    .then(job => {
      const urlMatch = /URL: (.+)/g.exec(job.log);
      if (!urlMatch) {
        return fail(obtainDarwinBuild, 'darwin');
      }
      downloadQueue.push({
        filename: `${require('../package.json').productName} OSX.zip`,
        platform: 'darwin',
        url: urlMatch[1],
        what: 'Darwin ZIP Artifact',
      });
      runQueue();
    })
    .catch(err => {
      if (err) console.error(err);
    });
};

const obtainLinuxBuilds = () => {
  console.log('Searching for Linux builds');
  fetch(`https://circleci.com/api/v1.1/project/github/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-?circle-token=${process.env.GPMDP_CIRCLE_TOKEN}`)
    .then(r => r.json())
    .then(builds => {
      const targetBuild = builds.find(b => b.subject === version);
      if (!targetBuild || targetBuild.status !== 'success') {
        return fail(obtainLinuxBuilds, 'linux');
      }
      return fetch(
        `https://circleci.com/api/v1.1/project/github/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/${targetBuild.build_num}/artifacts?circle-token=${process.env.GPMDP_CIRCLE_TOKEN}`
      );
    })
    .then(r => r.json())
    .then(artifacts => {
      artifacts.forEach(artifact => {
        let platformDir;
        if (path.extname(artifact.path) === '.rpm') {
          platformDir = 'redhat';
        } else if (path.extname(artifact.path) === '.deb') {
          platformDir = 'debian';
        }
        if (platformDir) {
          downloadQueue.push({
            platform: platformDir,
            url: artifact.url,
            what: `Linux ${platformDir} ${/i386/g.test(artifact.url) ? 'x86' : 'x64'} Installer Artifact`,
          });
        }
      });
      runQueue();
    })
    .catch(err => {
      if (err) console.error(err);
    });
};

obtainDarwinBuild();
obtainLinuxBuilds();
