import {Router} from 'express';
import multer from 'multer';
import {DateTime} from 'luxon';

import {Album, Photo} from '../models/bookshelf';
import {getSlug} from '../lib/helpers';
import Photos from '../lib/photos';

const photos = new Photos({
  rootDir: process.env.PHOTO_ROOT
});

const storage = multer.memoryStorage();
const upload = multer({buffer: storage});

const photosController = new Router();

photosController.get('/', (req,res) => {
  const context = {
    pageTitle: 'Pictures',
    breadCrumbs: [{
      url: '/pictures',
      title: 'Pictures'
    }]
  };

  Album.fetchAll({withRelated: ['coverPhoto']})
    .then( albums => {
      context.albums = albums.toJSON();
      res.render('photos', context);
      return null;
    })
    .catch( err => {
      console.log(err);
      context.error = err;
      res.render('photos', context);
    });
});

photosController.get('/:albumSlug', (req,res) => {
  Album.where('slug',req.params.albumSlug).fetch({withRelated:['coverPhoto']})
    .then( album => {
      album = album.toJSON();
      Photo.where('album',album.id).orderBy('date_taken').fetchAll()
        .then( photos => {          
          const context = {
            pageTitle: album.name, 
            breadCrumbs: [
              {url: '/pictures', title: 'Pictures'},
              {url: `/pictures/${album.slug}`, title: album.name}
            ],
            album: album,
            photos: photos.toJSON()
          }

          res.render('album-view', context)
        });
    });
});

photosController.get('/:albumSlug/:size/:filename', (req,res) => {
  // Load image file from storage`
  photos.getPhoto(req.params.albumSlug,req.params.filename,req.params.size)
    .then( photo => {
      res.set('Content-Type','image/jpeg');
      res.send(photo);
    })
    .catch( err => {
      console.error(err);
      res.status(404).send('Not Found');
    });
});

photosController.post('/', upload.single(), (req,res) => {
  const albumSlug = getSlug(req.body.name);
  const start =  DateTime.fromISO(req.body.startDate);
  const end = DateTime.fromISO(req.body.endDate);

  const album = new Album({
    name: req.body.name,
    slug: albumSlug,
    start_date: start.toJSDate(),
    end_date: end.toJSDate(),
    description: req.body.description || null
  });

  album.save()
    .then( () => {
      res.send('ok');
    })
    .catch( err => {
      console.error(err);
      res.send(err.message);
    })
});

photosController.post('/:albumId', upload.single('photo'), (req,res) => {
  // Create a url friendly file name
  const fileName = getSlug(req.file.originalname);

  Album.where('id',req.params.albumId).fetch() // Get the album to build the file path
    .then( album => {
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
        caption: req.body.caption || null
      });

      return photo.save();
    })
    .then( () => {
      res.send("ok");
    })
    .catch(err => {
      console.log(err);
      res.send(err.message);
    })
});

export default photosController;
