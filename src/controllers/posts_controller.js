import {Router} from 'express';
import {Post} from '../models/bookshelf';

const postsController = new Router();

postsController.get('/', (req,res) => {
  Post.fetchAll({withRelated: ['coverPhoto']})
    .then( posts => {
      posts = posts.toJSON()
      res.render('blog-page',{pageTitle: 'Blog', posts, breadCrumbs:[{url:'/blog',title:'Blog'}]});
      return null;
    })
    .catch( err => {
      res.render('blog-page',{pageTitle: 'Blog', error:err.message});
    });
});

postsController.get('/:slug', (req,res) => {
  Post.where('slug',req.params.slug).fetch()
    .then( post => {
      post = post.toJSON();
      res.render('post', {
        pageTitle: post.title,
        post,
        breadCrumbs:[
          {url: '/blog', title: 'Blog'},
          {url: `/blog/${post.slug}`, title: post.title}
        ]
      })
    })
    .catch( err => {
      res.render('post', {pageTitle: 'Error', error: err.message});
    });
});

export default postsController;
