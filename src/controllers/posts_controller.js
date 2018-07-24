import {Router} from 'express';
import {Post} from '../models/bookshelf';
import { getContext } from '../lib/helpers';

const postsController = new Router();

postsController.get('/', (req,res) => {
  Post.fetchAll({withRelated: ['coverPhoto']})
    .then( posts => {
      posts = posts.toJSON()
      res.render('blog-page', getContext("Josh's Blog", req, {posts}));
      return null;
    })
    .catch( err => {
      res.render('blog-page', getContext("Josh's Blog", req, {error: err}));
    });
});

postsController.get('/:slug', (req,res) => {
  Post.where('slug',req.params.slug).fetch()
    .then( post => {
      post = post.toJSON();
      res.render('post', getContext(post.title, req, {post}));
    })
    .catch( err => {
      res.render('post', getContext(post.title, req, {error: err}));
    });
});

export default postsController;
