const AdmZip = require('adm-zip');
const jsSha512 = require('js-sha512');
const yaml = require('js-yaml');
const fs = require('fs');

function createArchives() {
  try {
    //  https://github.com/cthackers/adm-zip/wiki/ADM-ZIP#a16
    const zip = new AdmZip();
    console.log('start');
    zip.addLocalFolder('/Users/apple/KIWI/test/electron-update-demo/test');
    zip.writeZip('/Users/apple/KIWI/test/electron-update-demo/bundle.zip');
    const buf = zip.toBuffer();
    const sha512 = jsSha512.sha512(buf);
    const y = yaml.safeLoad(fs.readFileSync('/Users/apple/KIWI/test/electron-update-demo/appveyor.yml', 'utf8'));
    fs.writeFileSync(
      '/Users/apple/KIWI/test/electron-update-demo/example.yml',
      yaml.safeDump(y),
      'utf8',
    );
    console.log('end', zip, buf, sha512, y);
  } catch (error) {
    console.log('error', error);
  }
}

export default function testAdmZip() {
  console.log('start testAdmZip');
  createArchives();
}

export { testAdmZip };
