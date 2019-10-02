import { Router } from 'express';
import bundles from './bundles';

export default (gcsBucket) => {
  const routes = Router();

  routes.use('/bundles', bundles(gcsBucket));

  return routes;
};
