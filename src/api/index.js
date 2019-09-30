import { Router } from 'express';
import v1 from './v1';

export default (gcsBucket) => {
  const routes = Router();

  routes.get('/status', (req, res) => {
    res.json({ status: 'OK' });
  });

  routes.use('/v1', v1(gcsBucket));

  return routes;
};
