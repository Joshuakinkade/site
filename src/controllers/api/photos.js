import logger from '../../logger';
import * as photos from '../../models/photos';

export const addPhoto = (req,res) => {
  // Create a url friendly file name
    photos.create(req.params.albumId, req.file, req.body)
    .then( photo => {
      res.send(`added photo with id: ${photo.id}`);
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
    photos.update(req.params.photoId, req.body)
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
  photos.getForAlbum(req.params.albumId)
    .then( photos => {
      res.send(photos);
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    });
}