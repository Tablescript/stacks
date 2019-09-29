import { config } from 'dotenv';
import createApp from './app';

config();

const {
  PORT = 8080,
} = process.env;

const run = () => {
  createApp().listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  }); // eslint-disable-line no-console
};

run();
