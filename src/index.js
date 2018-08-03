import express from 'express';
import compression from 'compression';
import consolidate from 'consolidate';
import dust from 'dustjs-linkedin';
import passport from 'passport';
import {BasicStrategy} from 'passport-http';

passport.use(new BasicStrategy( (username, password, done) => {
  if (username === process.env.API_USER && password === process.env.API_PASSWORD) {
    return done(null,{username: process.env.API_USER});
  } else {
    return done(null,false);
  }
}));


import Logger from './lib/logger';

import db from './models/db';

import homeController from './controllers/home_controller';
import photosController from './controllers/photos_controller';
import postsController from './controllers/posts_controller';

import {formatDate, formatDateTime, snippet, md} from './lib/dust-filters';

db.init();

const logger = new Logger({
  logLevel: process.env.NODE_ENV == 'development' ? Logger.DEBUG : Logger.INFO 
});

const app = express();

app.set('site-name', 'joshuakinkade.me');

app.disable('x-powered-by');

/* Configure Template Engine */
dust.filters.formatDate = formatDate;
dust.filters.formatDateTime = formatDateTime;
dust.filters.snippet = snippet;
dust.filters.md = md;

app.engine('dust', consolidate.dust);
app.set('view engine', 'dust');
app.set('views', './src/views');

/* * Serve Static Files */
app.use(express.static('./public'));

// TODO: auto-compile scss files in dev
// TODO: auto-compile client-side js in dev

app.use(compression());

app.use((req,res,next) => {
  logger.info(req.method + ' ' + req.originalUrl);
  next();
});

/* Configure Routes */
app.use('/',homeController);
app.use('/pictures',photosController);
app.use('/blog',postsController);

app.use((req,res) => {
  res.render('errors/not-found',{pageTitle:'Not Found'});
});

/* Start Server */
app.listen(process.env.PORT, (err) => {
  logger.info(`Server running on port ${process.env.PORT}`);
});