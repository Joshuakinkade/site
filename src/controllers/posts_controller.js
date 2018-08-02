import {Router} from 'express';
import {Post, Album} from '../models/bookshelf';
import { getContext } from '../lib/helpers';

const postsController = new Router();

postsController.get('/', (req,res) => {
  Post.fetchAll({withRelated: ['coverPhoto']})
    .then( posts => {
      posts = posts.toJSON();

      // Get the album for the cover photo for each post
      const requests = posts.map( post => {
        return Album.where('id',post.coverPhoto.album).fetch()
          .then( album => {
            post.coverPhoto.album = album.toJSON();
            return post;
          });
      });
 
      Promise.all(requests)
        .then( posts => {
          res.render('blog-page', getContext("Josh's Blog", req, {posts}));
        });

      return null;
    })
    .catch( err => {
      res.render('blog-page', getContext("Josh's Blog", req, {error: err}));
    });
});

postsController.get('/:slug', (req,res) => {
  Post.where('slug',req.params.slug).fetch({withRelated:['coverPhoto']})
    .then( post => {
      post = post.toJSON();
      
      // Get the album for the cover photo
      Album.where('id',post.coverPhoto.album).fetch()
        .then( album => {
          post.coverPhoto.album = album.toJSON();
          res.render('post', getContext(post.title, req, {post}));
        });
    })
    .catch( err => {
      console.error(err);
      res.render('post', getContext("Error", req, {error: err}));
    });
});

export default postsController;
