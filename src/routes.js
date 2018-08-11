import express from 'express';
import passport from 'passport';
import multer from 'multer';

import * as home from './controllers/home_controller';
import * as photos from './controllers/photos_controller';
import * as posts from './controllers/posts_controller';
import * as scripture from './controllers/scripture_controller';

const storage = multer.memoryStorage();
const upload = multer({buffer: storage});

const routes = new express.Router();

// Basic Routes
routes.get('/', home.index);
routes.get('/sitemap.xml', home.sitemap);

// Picture Routes
routes.get('/pictures', photos.index);
routes.get('/pictures/:albumSlug', photos.album);
routes.get('/pictures/:albumSlug/:size/:filename', photos.photo);

routes.post('/pictures', 
  passport.authenticate('basic', {session:false}), // Authenticate request
  upload.single(), // Parse request body
  photos.createAlbum);

routes.post('/pictures/:albumId',
  passport.authenticate('basic', {session:false}), // Authenticate request
  upload.single('photo'), // Parse request body
  photos.addPhoto);

// Blog Routes
routes.get('/blog', posts.index);
routes.get('/blog/:slug', posts.post);

routes.post('/blog', 
  passport.authenticate('basic', {session:false}),
  upload.single('post'),
  posts.addPost);

// Scripture Routes
routes.post('/scripture', 
  passport.authenticate('basic', {session: false}), 
  upload.single(), 
  scripture.postScripture);

export default routes;