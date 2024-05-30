export default {
  default: {
    paths: ['features/**/*.feature'],
    import: ['dist/step-definitions/**/*.js'],
    format: ['progress-bar', '@cucumber/pretty-formatter', 'json:./reports/cucumber_report.json'
    ],
  }
}
