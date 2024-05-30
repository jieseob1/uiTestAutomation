import { exec } from 'child_process';
import { globby } from 'globby';

const pattern = process.argv[2];
const features = process.argv[3];
const tag = process.argv[4] || '';

(async () => {
  try {
    const files = await globby(pattern);
    if (files.length === 0) {
      throw new Error(`No files found for pattern: ${pattern}`);
    }
    const importPaths = files.map(file => `--import ${file}`).join(' ');
    const command = `cucumber-js --format progress ${tag ? `--tags ${tag}` : ''} ${importPaths} ${features}`;
    console.log('Running command:', command);

    exec(command, { stdio: 'pipe' }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        console.error(`stdout: ${stdout}`);
        process.exit(1);
      } else {
        console.log(`stdout: ${stdout}`);
        console.log('Cucumber tests completed successfully.');
      }
    });
  } catch (err) {
    console.error('Error finding files:', err.message);
    process.exit(1);
  }
})();