import { Router } from 'express';
import v1 from './v1';

export default () => {
  const routes = Router();

  routes.use('/v1', v1);

  return routes;
};
