import { Router } from 'express';

export default () => {
  const routes = Router();

  routes.get('/bundles', (req, res) => {
    const response = {
      msg: 'I have a ham radio',
    };
    res.json(response);
  });

  return routes;
};
