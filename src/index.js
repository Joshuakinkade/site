import express from 'express';
import compression from 'compression';
import consolidate from 'consolidate';
import dust from 'dustjs-linkedin';
import passport from 'passport';
import {BasicStrategy} from 'passport-http';
import routes from './routes';
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

app.use(compression());

/* Log Request URLs */
app.use((req,res,next) => {
  logger.info(req.method + ' ' + req.originalUrl);
  next();
});

/* Configure Routes */
app.use('/',routes);

app.use((req,res) => {
  res.status(404).render('errors/not-found',{pageTitle:'Not Found'});
});

/* Start Server */
app.listen(process.env.PORT, (err) => {
  logger.info(`Server running on port ${process.env.PORT}`);
});