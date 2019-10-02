import { Router } from 'express';
import { Storage } from '@google-cloud/storage';

const buildBundle = (version, dependencies = {}) => ({
  version,
  dependencies,
});

const buildBundles = (name, bundleDefs) => ({
  [name]: {
    manifest: {
      name,
      latest: bundleDefs[bundleDefs.length - 1].version,
      versions: bundleDefs.map((def) => def.version),
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

export default (gcsBucket) => {
  const routes = Router();

  routes.get('/bundles/:name/manifest', (req, res) => {
    res.json(repo[req.params.name].manifest);
  });

  routes.get('/bundles/:name/-/:filename', (req, res, next) => {
    const { name, filename } = req.params;

    const storage = new Storage();
    const bucket = storage.bucket(gcsBucket);
    const file = bucket.file(`${name}/${filename}`);

    res.status(200);
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/gzip');

    try {
      const reader = file.createReadStream();
      reader.on('error', (e) => {
        throw new Error(e);
      });

      reader.pipe(res);
    } catch (e) {
      next(e);
    }
  });

  return routes;
};
