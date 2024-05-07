// generate-report.js
// const reporter = require('cucumber-html-reporter');
import reporter from 'cucumber-html-reporter';
const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber-report.json',
  output: 'reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': 'STAGING',
    Browser: 'Chrome 93.0',
    Platform: 'Windows 10'
  }
};

try {
  reporter.generate(options);
} catch (err) {
  console.error('Failed to generate HTML report:', err);
}