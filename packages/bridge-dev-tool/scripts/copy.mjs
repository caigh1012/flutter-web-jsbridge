import fs from 'fs-extra';
import path from 'path';

const pwd = process.cwd();

const sourcePath = path.join(pwd, 'dist');

const targetPath = path.join(pwd, '../bridge-mock/dist');

fs.copySync(sourcePath, targetPath, { overwrite: true }, (err) => {
  if (err) {
    console.error('Error copying files:', err);
  } else {
    console.log('Files copied successfully!');
  }
});
