import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';

import logger from '../logger';
import {Album} from '../models/bookshelf';
import {getContext} from '../lib/helpers';
import Photos from '../lib/photos';

import * as albumService from '../models/albums';
import * as photoService from '../models/photos';

import App from '../react/App';

const photos = new Photos({
  rootDir: process.env.PHOTO_ROOT
});

export const index = (req,res) => {
  Album.query('orderBy','start_date', 'desc').fetchAll({withRelated: ['coverPhoto']})
    .then( albums => {
      albums = albums.toJSON();
      res.render('photos', getContext("Josh's Pictures", req, {albums}));
      return null;
    })
    .catch( err => {
      logger.error(err);
      res.render('errors/system-error');
    });
};

export const album = (req,res) => {
  return Album.where('slug',req.params.albumSlug).fetch({withRelated:['coverPhoto']})
    .then( album => {
      album = album.toJSON();
      return photoService.getForAlbum(album.id)
        .then( photos => {
          const initialState = {album, photos, error: null};
          const location = req.url;
          const context = {};
          const html = ReactDOMServer.renderToString(
            <StaticRouter location={location} context={context}>
              <App albumId={album.id} initialState={initialState}/>
            </StaticRouter>
          );
          return res.render('album-view', getContext(album.name, req, {album, app: html, initialState}));
        });
    })
    .catch( err => {
      logger.error(err.message);
      res.render('errors/system-error');
    })
};

export const photo = (req,res) => {
  // Load image file from storage`
  photos.getPhoto(req.params.albumSlug,req.params.filename,req.params.size)
    .then( photo => {
      if (!photo) {
        res.status(404).send('Not Found');
      }
      res.set('Content-Type','image/jpeg');
      res.set('Cache-Control', 'max-age=' + 60 * 60 * 24 * 7);
      res.send(photo);
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send('Internal Server Error');
    });
};