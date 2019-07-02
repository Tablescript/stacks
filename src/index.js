import { config } from 'dotenv';
import express from 'express';
import api from './api';

config();

const {
  PORT = 8080,
} = process.env;

const run = () => {
  const app = express();
  app.use(api);
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // eslint-disable-line no-console
};

run();
