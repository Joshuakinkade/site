import {DateTime} from 'luxon';
import {Post, Album} from '../models/bookshelf';
import { getContext, getSlug } from '../lib/helpers';
import PostParser from '../lib/post-parser';

export const index = (req, res) => {
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
};

export const post = (req, res) => {
  Post.where('slug',req.params.slug).fetch({withRelated:['coverPhoto']})
    .then( post => {
      post = post.toJSON();
      
      // Get the album for the cover photo
      return Album.where('id',post.coverPhoto.album).fetch()
        .then( album => {
          post.coverPhoto.album = album.toJSON();
          res.render('post', getContext(post.title, req, {post}));
          return null;
        });
    })
    .catch( err => {
      console.error(err);
      res.render('post', getContext("Error", req, {error: err}));
    });
};

export const addPost = (req, res) => {
  const postText = req.file.buffer.toString('utf8');

  const parser = new PostParser(postText);
  try {
    const postData = parser.parse();

    const postDate = postData.metadata.date ? DateTime.fromISO(postData.metadata.date) : DateTime.utc();
    if (!postData.metadata.hasOwnProperty('title')) {
      throw new Error('A title is required');
    } 

    const post = new Post({
      title: postData.metadata.title,
      slug: getSlug(postData.metadata.title),
      post_date: postDate,
      headline: postData.metadata.headline || null,
      text: postData.text
    });

    post.save()
      .then( () => {
        res.status(200).send('ok');
      })
      .catch( err => {
        res.status(500).send(err.message);
      })
  } catch(err) {
    res.status(400).send(err.message);
  }
}