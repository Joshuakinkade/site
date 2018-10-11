import express from 'express';
import passport from 'passport';
import multer from 'multer';

import * as home from './controllers/home_controller';
import * as albumAPI from './controllers/api/albums';
import * as photoAPI from './controllers/api/photos';
import * as blockAPI from './controllers/api/blocks';
import * as photos from './controllers/photos_controller';
import * as posts from './controllers/posts_controller';
import * as scripture from './controllers/scripture_controller';
import * as projects from './controllers/projects_controller';

const storage = multer.memoryStorage();
const upload = multer({buffer: storage});

const basicAuth = passport.authenticate('basic', {session: false});

const routes = new express.Router();

// Basic Routes
routes.get('/', home.index);
routes.get('/sitemap.xml', home.sitemap);

// Photos Routes
routes.get('/pictures', photos.index);
routes.get('/pictures/:albumSlug', photos.album);
routes.get('/pictures/:albumSlug/:size/:filename', photos.photo);

// Projects Routes
routes.get('/projects/stories', projects.stories);

// Blog Routes
routes.get('/blog', posts.index);
routes.get('/blog/:slug', posts.post);

routes.post('/blog', 
  passport.authenticate('basic', {session: false}),
  upload.single('post'),
  posts.addPost);

// Scripture Routes
routes.post('/scripture', 
  passport.authenticate('basic', {session: false}), 
  upload.single(), 
  scripture.postScripture);

// Api Routes
routes.get('/api/albums',
  passport.authenticate('basic', {session: false}),
  albumAPI.listAlbums);

routes.get('/api/albums/:albumId',
  passport.authenticate('basic', {session: false}),
  albumAPI.getAlbum);

routes.post('/api/albums',
  passport.authenticate('basic', {session:false}), // Authenticate request
  upload.single(), // Parse request body
  albumAPI.createAlbum);

routes.put('/api/ablums/:albumId',
  passport.authenticate('basic', {session: false}),
  upload.single(),
  albumAPI.updateAlbum);

routes.post('/api/ablums/:albumId/photos',
  passport.authenticate('basic', {session: false}), // Authenticate request
  upload.single('photo'), // Parse request body
  photoAPI.addPhoto);

routes.put('/api/albums/:albumId/photos/:photoId',
  passport.authenticate('basic', {session: false}),
  upload.single(),
  photoAPI.updatePhotoInfo);

routes.get('/api/albums/:albumId/photos',
  passport.authenticate('basic', {session: false}),
  photoAPI.listPhotos);

routes.get('/api/albums/:albumId/blocks',
  passport.authenticate('basic', {session: false}),
  blockAPI.listBlocks);

routes.post('/api/albums/:albumId/blocks',
  passport.authenticate('basic', {session: false}),
  upload.single(),
  blockAPI.addBlock);

routes.put('/api/albums/:ablumId/blocks/:blockId',
  basicAuth,
  upload.single(),
  blockAPI.updateBlock);

routes.delete('/api/albums/:ablumId/blocks/:blockId',
  basicAuth,
  blockAPI.deleteBlock);

export default routes;