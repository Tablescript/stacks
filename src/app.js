import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import api from './api';

const createApp = (gcsBucket) => {
  const app = express();
  app.disable('x-powered-by');

  app.use(logger('dev', {
    skip: () => app.get('env') === 'test',
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '../public')));

  // Routes
  app.use('/api', api(gcsBucket));

  // Catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Error handler
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.log(`Error: ${err.message}`); // eslint-disable-line no-console
    res
      .status(err.status || 500)
      .json({
        message: err.message,
      });
  });

  return app;
};

export default createApp;
