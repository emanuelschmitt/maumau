import path from 'path';

const manifest: Record<string, string> = require('./bundle/manifest.json');

type Bundle = {
  fileName: string;
  filePath: string;
  filePathAbs: string;
};

export type Statics = {
  bundles: Bundle[];
  publicDirectory: string;
  bundleDirectory: string;
};

function getBundleFiles() {
  const bundles: Bundle[] = [];
  for (const [key, value] of Object.entries(manifest)) {
    if (/.*(.js$)/i.test(key)) {
      bundles.push({
        fileName: key,
        filePath: value,
        filePathAbs: path.resolve(__dirname, 'bundle', value),
      });
    }
  }

  if (bundles.length === 0) {
    throw Error(`no bundles found`);
  }

  return bundles;
}

export function getClientStatics(): Statics {
  return {
    bundles: getBundleFiles(),
    publicDirectory: path.resolve(__dirname, 'public'),
    bundleDirectory: path.resolve(__dirname, 'bundle'),
  };
}
