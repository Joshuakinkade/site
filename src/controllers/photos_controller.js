import {DateTime} from 'luxon';

import logger from '../logger';
import {Album, Photo} from '../models/bookshelf';
import {getSlug, getContext} from '../lib/helpers';
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
      logger.error(err);
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

export const createAlbum = (req,res) => {
    const albumSlug = getSlug(req.body.name);
    const start =  DateTime.fromISO(req.body.startDate);
    const end = DateTime.fromISO(req.body.endDate);

    if (!start.isValid) {
      return res.status(400).send('Start Date not valid');
    }

    if (!end.isValid) {
      return res.status(400).send('End Date not valid');
    }

    const album = new Album({
      name: req.body.name,
      slug: albumSlug,
      start_date: start,
      end_date: end,
      description: req.body.description || null
    });

    album.save()
      .then( (model) => {
        res.send(`created album with id: ${model.id}`);
      })
      .catch( err => {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).send('Album name is taken. Choose another.');
        }
        logger.error(err.message);
        res.status(500).send(err.message);
      })
};

export const updateAlbum = (req, res) => {
  Album.where('id', req.params.albumId).fetch()
    .then( album => {
      if (!album) {
        return res.status(404).send(`Album with id ${req.params.albumId} does not exist`);
      }

      const newData = Object.assign({},req.body);

      // Copy properties from the request body to the album
      for (const key in newData) {
        if (newData.hasOwnProperty(key)) {
          const value = newData[key];
          album.set(key,value);
        }
      }

      return album.save()
        .then( () => {
          res.send('ok');
        });
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    });
}

export const addPhoto = (req,res) => {
  // Create a url friendly file name
  const fileName = getSlug(req.file.originalname);

  Album.where('id',req.params.albumId).fetch() // Get the album to build the file path
    .then( album => {
      if (!album) {
        throw new Error('Album not found');
      }
      
      const slug = album.get('slug');
      // Save the image file
      return photos.addPhoto(slug,fileName,req.file.buffer);
    })
    .then( (photoInfo) => {
      // Create a new photo record and save it
      const photo = new Photo({
        name: req.file.originalname, 
        filename: fileName,
        album: req.params.albumId,
        date_taken: photoInfo.dateTaken,
        caption: req.body.caption || null,
        height: photoInfo.size.height,
        width: photoInfo.size.width
      });

      return photo.save();
    })
    .then( (model) => {
      res.send(`added photo with id: ${model.id}`);
    })
    .catch(err => {
      if (err.message == 'Album not found') {
        return res.status(404).send('Album not found');
      }
      logger.error(err.message);
      res.status(500).send(err.message);
    });
};

export const updatePhotoInfo = (req, res) => {
  Photo.where('id', req.params.photoId).fetch()
    .then( photo => {
      if (!photo) {
        throw new Error('Photo not found');
      }

      if (req.body.caption) {
        photo.set('caption', req.body.caption);
      }

      return photo.save();
    })
    .then( model => {
      res.send(`photo info updated for photo: ${model.id}`);
    })
    .catch( err => {
      if (err.message == 'Photo not found') {
        return res.status(404).send('Photo not found');
      }
      logger.error(err.message);
      res.status(500).send(err.message);
    });
}

export const listAlbums = (req, res) => {
  Album.fetchAll()
    .then( albums => {
      res.send(albums.toJSON());
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    })
}

export const listPhotos = (req, res) => {
  Photo.where('album', req.params.albumId).fetchAll()
    .then( photos => {
      res.send(photos.toJSON());
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    })
}