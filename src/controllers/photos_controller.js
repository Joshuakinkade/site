import {Router} from 'express';
import multer from 'multer';
import {DateTime} from 'luxon';
import passport from 'passport';

import {Album, Photo} from '../models/bookshelf';
import {getSlug, getContext} from '../lib/helpers';
import Photos from '../lib/photos';

const photos = new Photos({
  rootDir: process.env.PHOTO_ROOT
});

const storage = multer.memoryStorage();
const upload = multer({buffer: storage});

const photosController = new Router();

photosController.get('/', (req,res) => {
  Album.fetchAll({withRelated: ['coverPhoto']})
    .then( albums => {
      albums = albums.toJSON();
      res.render('photos', getContext("Josh's Pictures", req, {albums}));
      return null;
    })
    .catch( err => {
      console.log(err);
      res.render('photos', getContext("Josh's Picutres", req, {error: err}));
    });
});

photosController.get('/:albumSlug', (req,res) => {
  Album.where('slug',req.params.albumSlug).fetch({withRelated:['coverPhoto']})
    .then( album => {
      album = album.toJSON();
      Photo.where('album',album.id).orderBy('date_taken').fetchAll()
        .then( photos => {       
          photos = photos.toJSON();   
          res.render('album-view', getContext(album.name, req, {album,photos}));
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

photosController.post('/', passport.authenticate('basic', {session: false}), upload.single(), (req,res) => {
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
        caption: req.body.caption || null,
        height: photoInfo.size.height,
        width: photoInfo.size.width
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
