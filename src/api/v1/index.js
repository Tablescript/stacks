import { Router } from 'express';
import fs from 'fs';

const buildBundle = (version, dependencies = {}) => ({
  version,
  dependencies,
});

const buildBundles = (name, bundleDefs) => ({
  [name]: {
    manifest: {
      name,
      latest: bundleDefs[bundleDefs.length - 1].version,
      versions: bundleDefs.map(def => def.version),
    },
    versions: {
      ...bundleDefs.reduce((acc, bundleDef) => ({
        ...acc,
        [bundleDef.version]: {
          name,
          ...bundleDef,
        },
      }), {}),
    },
  },
});

const repo = {
  ...buildBundles(
    'dnd4e',
    [
      buildBundle('1.0.0', { a: '^1.0.0', b: '^1.0.0' }),
      buildBundle('1.0.1', { a: '^1.0.1', b: '^1.0.0' }),
      buildBundle('1.0.2', { a: '^1.0.1', b: '^1.0.0' }),
    ],
  ),
  ...buildBundles(
    'a',
    [
      buildBundle('1.0.0', { c: '^1.0.0' }),
      buildBundle('1.0.1', { c: '^1.0.1' }),
      buildBundle('1.0.2', { c: '^1.0.1' }),
      buildBundle('1.1.0', { c: '^1.0.1' }),
      buildBundle('2.0.0', { c: '^1.0.1' }),
    ],
  ),
  ...buildBundles(
    'b',
    [
      buildBundle('1.0.0', { c: '^1.0.0' }),
    ],
  ),
  ...buildBundles(
    'c',
    [
      buildBundle('1.0.0', {}),
      buildBundle('1.0.1', {}),
    ],
  ),
  ...buildBundles(
    'classes',
    [
      buildBundle('1.0.0', { stuff: '^1.0.0' }),
    ],
  ),
  ...buildBundles(
    'stuff',
    [
      buildBundle('1.0.0', {}),
    ],
  ),
};

const repoRoot = '/Users/jamie/src/tablescript/js/stacks/repo';

export default () => {
  const routes = Router();

  routes.get('/bundles/:name/manifest', (req, res) => {
    res.json(repo[req.params.name].manifest);
  });
  routes.get('/bundles/:name/-/:filename', (req, res) => {
    const { name, filename } = req.params;
    const fileToSend = `${repoRoot}/${name}/${filename}`;
    const readStream = fs.createReadStream(fileToSend);
    res.status(200);
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/gzip');
    readStream.pipe(res);
  });

  return routes;
};
