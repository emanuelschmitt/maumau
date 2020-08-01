import path from 'path';

const manifest: Record<string, string> = require('./bundle/manifest.json');

function getBundleFile() {
  for (const [key, value] of Object.entries(manifest)) {
    if (key === 'main.js') {
      return {
        fileName: key,
        filePath: value,
        filePathAbs: path.resolve(__dirname, 'bundle', value),
      };
    }
  }
  throw Error(`can't find bundle main.js`);
}

export function getClientStatics() {
  return {
    bundle: getBundleFile(),
    publicDirectory: path.resolve(__dirname, 'public'),
    bundleDirectory: path.resolve(__dirname, 'bundle'),
  };
}
