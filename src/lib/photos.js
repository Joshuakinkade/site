import {DateTime} from 'luxon';
import sharp from 'sharp';
import exif from 'exif-parser';

import Library from './library';

export default class PhotoStorage {
  constructor(options) {
    this.library = new Library(options.rootDir);
  }

  addPhoto(folder,name,photo) {
    return sharp(photo)
      .rotate() // auto-rotate images from phones
      .withMetadata()
      .jpeg()
      .toBuffer()
      .then( data => {
        const parser = exif.create(data);
        parser.enableSimpleValues(false);
        const exifData = parser.parse();
        const date = exifData.tags.CreateDate || exifData.tags.DateTimeOriginal || DateTime.now();
        const dateTaken = DateTime.fromFormat(date, 'yyyy:MM:dd HH:mm:ss');
        return this.library.writeFile(folder, name, data)
          .then( (savedAsName) => {
            const photoData = {
              savedAsName,
              dateTaken: dateTaken,
              location: [exifData.tags.GPSLatitude, exifData.tags.GPSLongitude],
              size: exifData.imageSize
            };
            return photoData;
          });
      });
  }

  getPhoto(folder, name, size) {
    if (size !== 'full') {
      // Try to get resized image
      return this.library.readFile(`${folder}/${size}`, name)
        .then( photoData => {
          if (photoData) {
            return photoData;
          } else {
            // Create the resized image and return it
            return this._resizePhoto(folder, name, size);
          }
        });
    } else {
      return this.library.readFile(folder, name)
      .then( photoData => {
        return photoData;
      });
    }
  }

  _resizePhoto(folder, name, size) {
    return this.library.readFile(folder, name)
    .then( photoData => {
      if (photoData) {
        let photo = sharp(photoData).withMetadata();
        if (size === 'thumb') {
          photo = photo.resize(512,null).jpeg({quality:50});
        } else if (size === 'mid') {
          photo = photo.resize(1366,null).jpeg({quality: 75});
        }
        return photo.toBuffer()
          .then( (data) => {
            this.library.writeFile(`${folder}/${size}`, name, data)
            .catch( err => {
              console.error(err.message);
              return null;
            });

            return data;
          });
      } else {
        return null;
      }
    });
  }
}