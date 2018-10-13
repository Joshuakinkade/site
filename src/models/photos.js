import {Album, Photo} from './bookshelf';
import Photos from '../lib/photos';
import{getSlug} from '../lib/helpers';

const photoService = new Photos({
  rootDir: process.env.PHOTO_ROOT
});

export const getForAlbum = (albumId) => {
  return Photo.where('album', albumId).fetchAll()
    .then( photos => photos.toJSON());
} 

export const create = (albumId, file, data) => {
  const fileName = getSlug(file.originalname);

  return Album.where('id', albumId).fetch() // Get the album to build the file path
    .then( album => {
      if (!album) {
        throw new Error('Album not found');
      }
      
      const slug = album.get('slug');
      // Save the image file
      return photoService.addPhoto(slug, fileName, file.buffer);
    })
    .then( (photoInfo) => {
      // Create a new photo record and save it
      const photo = new Photo({
        name: file.originalname, 
        filename: fileName,
        album: albumId,
        date_taken: photoInfo.dateTaken,
        caption: data.caption || null,
        height: photoInfo.size.height,
        width: photoInfo.size.width
      });

      return photo.save();
    });
}

export const update = (photoId, data) => {
  return Photo.where('id', photoId).fetch()
  .then( photo => {
    if (!photo) {
      throw new Error('Photo not found');
    }

    if (data.caption) {
      photo.set('caption', data.caption);
    }

    return photo.save();
  })
}