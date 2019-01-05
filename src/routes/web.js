import express from 'express';

import * as home from '../controllers/home_controller';
import * as photos from '../controllers/photos_controller';
import * as posts from '../controllers/posts_controller';

const routes = new express.Router();

// Basic Routes
routes.get('/', home.index);
routes.get('/sitemap.xml', home.sitemap);

// Picture Routes
routes.get('/pictures', photos.index);
routes.get('/pictures/:albumSlug', photos.album);
routes.get('/pictures/:albumSlug/:size/:filename', photos.photo);

// Blog Routes
routes.get('/blog', posts.index);
routes.get('/blog/:slug', posts.post);

export default routes;