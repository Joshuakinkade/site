import express from 'express';
import compression from 'compression';
import consolidate from 'consolidate';
import dust from 'dustjs-linkedin';
import passport from 'passport';
import {BasicStrategy} from 'passport-http';
import routes from './routes/web';
import apiRoutes from './routes/api';
import logger from './logger';
import {formatDate, formatDateTime, snippet, md} from './lib/dust-filters';

/* Configure Authentication */
passport.use(new BasicStrategy( (username, password, done) => {
  if (username === process.env.API_USER && password === process.env.API_PASSWORD) {
    return done(null,{username: process.env.API_USER});
  } else {
    return done(null,false);
  }
}));

/* Configure app */
const app = express();
app.set('site-name', process.env.SITE_NAME);
app.disable('x-powered-by');

/* Configure Template Engine */
dust.filters.formatDate = formatDate;
dust.filters.formatDateTime = formatDateTime;
dust.filters.snippet = snippet;
dust.filters.md = md;

app.engine('dust', consolidate.dust);
app.set('view engine', 'dust');
app.set('views', './src/views');

/* Serve Static Files */
app.use(express.static('./public'));

/* Enable response compression */
app.use(compression());

/* Log Request URLs */
app.use((req,res,next) => {
  logger.info(req.method + ' ' + req.originalUrl);
  next();
});

/* Configure Routes */
app.use('/', routes);
app.use('/api', apiRoutes);

app.use((req,res) => {
  res.status(404).render('errors/not-found',{pageTitle:'Not Found'});
});

/* Start Server */
const port = process.env.PORT;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, (err) => {
  if (err) {
    logger.error(err.message);
  } else {
    logger.info(`Server running at ${host}:${port}`);
  }
});