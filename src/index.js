import { config } from 'dotenv';
import createApp from './app';

config();

const {
  PORT = 8080,
  GCS_BUCKET = 'org-tablescript-stacks',
} = process.env;

const run = () => {
  createApp(GCS_BUCKET).listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  }); // eslint-disable-line no-console
};

run();
