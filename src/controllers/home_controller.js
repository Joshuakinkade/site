import {Album, Post, Scripture} from '../models/bookshelf';
import logger from '../logger';
import * as albumService from '../models/albums';
import * as postService from '../models/posts';
import {combineRecents, getContext} from '../lib/helpers';
import {addCoverPhoto, addCoverPhotoAlbum} from './posts_controller';

export const index = (req,res) => {
  const RECENT_POST_COUNT = 3;

  const queries = [];

  queries.push(albumService.getRecent({count: RECENT_POST_COUNT}));

  queries.push(postService
    .getRecent({count: RECENT_POST_COUNT})
    .then( posts => {
      const albumQueries = posts.map( post =>
        post.coverPhoto ?
        albumService.getById(post.coverPhoto.album).then( album => {
          post.coverPhoto.album = album
          return post;
        }) :
        post
      );
      return Promise.all(albumQueries).then( posts => {
        return posts;
      });
    }));

  queries.push(Scripture
    .query('orderBy','created_at','desc')
    .query('limit', 1)
    .fetch());

  Promise.all(queries)
    .then( ([albums,posts,scripture]) => {

      albums = albums.map( album => {
        album.type = 'Album';
        return album;
      });

      posts = posts.map( post => {
        post.type = 'Post';
        return post;
      });

      const recents = combineRecents(albums,posts).slice(0,RECENT_POST_COUNT);

      scripture = scripture ? scripture.toJSON()  : null;

      res.render('home',getContext('Home', req, {recents, scripture}));
    })
    .catch( err => {
      logger.error(err.message);
      res.render('errors/system-error');
    });
};

export const sitemap = (req,res) => {
  const queries = [
    Album.query('orderBy','start_date').fetchAll(),
    Post.query('orderBy','post_date').fetchAll()
  ];

  Promise.all(queries)
    .then( ([albums,posts]) => {
      albums = albums.toJSON();
      posts = posts.toJSON();
      res
        .set('Content-Type','text/xml')
        .render('sitemap',{baseUrl:'https://joshuakinkade.me',albums,posts});
    })
    .catch( err => {
      res.status(500).send('Internal Server Error');
    });

};