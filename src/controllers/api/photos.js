import {Album, Photo} from '../../models/bookshelf';
import Photos from '../../lib/photos';
import{getSlug} from '../../lib/helpers';
import logger from '../../logger';

const photos = new Photos({
  rootDir: process.env.PHOTO_ROOT
});

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

// API
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