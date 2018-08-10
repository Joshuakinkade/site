import {DateTime} from 'luxon';
import logger from '../logger';
import {Post, Album, Photo} from '../models/bookshelf';
import { getContext, getSlug } from '../lib/helpers';
import PostParser from '../lib/post-parser';

export const index = (req, res) => {
  Post.query('orderBy','post_date','desc').fetchAll()
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
          console.error(err);
          return res.render('post', getContext("Error", req, {error: err}));
        });
    })
    .catch( err => {
      logger.error(err);
      res.render('errors/system-error');
    });
};

export const post = (req, res) => {
  Post.where('slug',req.params.slug).fetch({withRelated:['coverPhoto']})
    .then( post => {
      post = post.toJSON();
      return addCoverPhotoAlbum(post);
    })
    .then( post => {
      res.render('post', getContext(post.title, req, {post}));
    })
    .catch( err => {
      logger.error(err);
      res.render('errors/system-error');
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
        if (err.code == 'ER_DUP_ENTRY') {
          return res.status(400).send('Post title is taken. Choose another one');
        }
        logger.error(err.message);
        return res.status(500).send(err.message);
      })
  } catch(err) {
    res.status(400).send(err.message);
  }
}

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