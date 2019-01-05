import logger from '../logger';
import {Post, Album, Photo} from '../models/bookshelf';
import {getContext} from '../lib/helpers';

export const index = (req, res) => {
  return Post.query('orderBy','post_date','desc').fetchAll()
    .then( posts => {
      posts = posts.toJSON();

      // Get the cover photo and it's album for each post
      const requests = posts.map( post => {
        return addCoverPhoto(post).then( post => addCoverPhotoAlbum(post));
      });
 
      return Promise.all(requests)
        .then( posts => {
          return res.render('blog-page', getContext("Josh's Blog", req, {posts}));
        })
        .catch( err => {
          logger.error(err);
          return res.render('post', getContext("Error", req, {error: err}));
        });
    })
    .catch( err => {
      logger.error(err);
      res.render('errors/system-error');
    });
};

export const post = (req, res) => {
  return Post.where('slug',req.params.slug).fetch({withRelated:['coverPhoto']})
    .then( post => {
      post = post.toJSON();
      return addCoverPhotoAlbum(post);
    })
    .then( post => {
      res.render('post', getContext(post.title, req, {post}));
      return null;
    })
    .catch( err => {
      logger.error(err);
      res.render('errors/system-error');
    });
};

export function addCoverPhotoAlbum(post) {
  if (post.coverPhoto) {
    return Album.where('id',post.coverPhoto.album).fetch()
    .then( album => {
      post.coverPhoto.album = album.toJSON();
      return post;
    });
  } else {
    return Promise.resolve(post);
  }
}

export function addCoverPhoto(post) {
  if (post.cover_photo) {
    return Photo.where('id',post.cover_photo).fetch()
      .then( photo => {
        post.coverPhoto = photo.toJSON();
        return post;
      });
  } else {
    return Promise.resolve(post);
  }
}