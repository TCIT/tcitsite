/* eslint consistent-return:0 */

const express = require('express');
const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
// se depreca ngrok
// const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const proxy = require('http-proxy-middleware');
const fakeApi = require('./fakeApi');
const resolve = require('path').resolve;
const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

if (isDev) {
  // En desarrollo acoplamos el fake service.
  app.use('/api', fakeApi.app);
  // En desarrollo hacemos un proxy de la API de Inpatient para lidiar con CORS.
  const inpatientProxy = proxy({
    target: 'http://rayensaludinpatient.azurewebsites.net',
    changeOrigin: true,
    pathRewrite: {'^/inpatient/api': '/api'},
  })
  app.use('/inpatient', inpatientProxy);
}

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  logger.appStarted(port, prettyHost);

  // se depreca ngrok
  // Connect to ngrok in dev mode
  // if (ngrok) {
  //   ngrok.connect(port, (innerErr, url) => {
  //     if (innerErr) {
  //       return logger.error(innerErr);
  //     }

  //     logger.appStarted(port, prettyHost, url);
  //   });
  // } else {
  //   logger.appStarted(port, prettyHost);
  // }
});
