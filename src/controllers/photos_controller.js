import {DateTime} from 'luxon';

import logger from '../logger';
import {Album, Photo} from '../models/bookshelf';
import {getContext} from '../lib/helpers';
import Photos from '../lib/photos';

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
  Album.where('slug',req.params.albumSlug).fetch({withRelated:['coverPhoto']})
    .then( album => {
      album = album.toJSON();
      return Photo.where('album',album.id).orderBy('date_taken').fetchAll()
        .then( photos => {       
          photos = photos.toJSON();

          let subTitle = album.start_date.setLocale('en-US').toLocaleString(DateTime.DATE_FULL);
          
          if (!album.start_date.equals(album.end_date)) {
            subTitle += ' - ' + album.end_date.setLocale('en-US').toLocaleString(DateTime.DATE_FULL);
          }

          res.render('album-view', getContext(album.name, req, {album,photos,subTitle}));
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