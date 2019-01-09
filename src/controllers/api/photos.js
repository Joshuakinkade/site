import logger from '../../logger';
import {Album, Photo} from '../../models/bookshelf';
import {getSlug} from '../../lib/helpers';
import Photos from '../../lib/photos';

const photos = new Photos({
  rootDir: process.env.PHOTO_ROOT
});

export const addPhoto = (req,res) => {
// Create a url friendly file name
const fileName = getSlug(req.file.originalname);
let album;

Album.where('id',req.params.albumId).fetch() // Get the album to build the file path
  .then( a => {
    if (!a) {
      throw new Error('Album not found');
    }

    album = a;
    
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

    return photo.save().then( ({id}) => {
      photo.id = id;
      photo.set('date_taken', photoInfo.dateTaken);
      return photo;
    });
  })
  .then( photo => {
    const photoDate = photo.get('date_taken');
    const start = album.get('start_date');
    const end = album.get('end_date');

    if (start === null || start > photoDate) {
      album.set('start_date', photoDate);
    }

    if (end === null || end < photoDate) {
      album.set('end_date', photoDate);
    }

    return album.save().then( () => photo);
  })
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