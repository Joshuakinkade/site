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
        const dateTaken = DateTime.fromFormat(exifData.tags.CreateDate, 'yyyy:MM:dd HH:mm:ss');
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
    // TODO: If size isn't full, check for existing image with requested size.
    return this.library.readFile(folder, name)
      .then( photoData => {
        let photo = sharp(photoData).withMetadata();
        if (size === 'thumb') {
          photo = photo.resize(512,null).jpeg({quality:50});
          // TODO: Save the thumbnail after creating it.
        } else if (size === 'mid') {
          photo = photo.resize(1366,null).jpeg({quality: 75});
        }

        return photo.toBuffer();
      });
  }
}