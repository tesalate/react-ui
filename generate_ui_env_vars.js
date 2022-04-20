require('dotenv').config();
const fs = require('file-system');

const BUILD_ENVIRONMENT = process.env.BUILD_ENVIRONMENT || 'production';

(function main() {
  let envs = {
    REACT_APP_BUILD_ENVIRONMENT: BUILD_ENVIRONMENT === 'prod' ? 'production' : BUILD_ENVIRONMENT,
    REACT_APP_VERSION: '$npm_package_version',
  };
  // CREATE THE ENVS OBJECT THAT WILL BE INJECTED INTO .env BASED ON BUILD_ENVIRONMENT
  switch (BUILD_ENVIRONMENT) {
    case 'local':
      envs = {
        ...envs,
        REACT_APP_API_URL: 'http://localhost:4400',
        REACT_APP_NAME: 'tesalate-local',
      };
      break;

    case 'test':
      envs = {
        ...envs,
        REACT_APP_API_URL: 'https://app-test.tesalate.io',
        REACT_APP_NAME: 'tesalate-test',
      };
      break;

    default: //production
    case 'prod':
      envs = {
        ...envs,
        REACT_APP_API_URL: 'https://app.tesalate.io',
        BUILD_ENVIRONMENT: 'production',
        REACT_APP_NAME: 'tesalate',
      };
      break;
  }

  try {
    // TRANSFORM OBJECT INTO KEY=VALUE FOR .env FILE
    let content = '';
    for (let key in envs) {
      content += `${key}=${envs[key]}\n`;
    }
    // WRITE THE FILE TO THE CURRENT DIRECTORY
    fs.writeFileSync('./.env', content);
    console.log('SUCCESSFULLY WROTE ENV FILE:\n', content);
  } catch (err) {
    // MIGHT WANT SOME BETTER ERROR HANDLING HERE
    console.error(err);
    process.exit(1);
  }
})();
