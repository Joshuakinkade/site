import {Album, Post, Scripture} from '../models/bookshelf';
import logger from '../logger';
import {combineRecents, getContext} from '../lib/helpers';
import {addCoverPhoto, addCoverPhotoAlbum} from './posts_controller';

export const index = (req,res) => {
  const RECENT_POST_COUNT = 3;

  const queries = [];

  queries.push(Album
    .query('orderBy','start_date','desc')
    .query('limit', RECENT_POST_COUNT)
    .fetchAll({withRelated: ['coverPhoto']}));

  queries.push(Post
    .query('orderBy','post_date','desc')
    .query('limit',RECENT_POST_COUNT)
    .fetchAll().then( posts => {
      posts = posts.toJSON();
      return Promise.all(posts.map( post => {
        return addCoverPhoto(post).then( post => addCoverPhotoAlbum(post));
      }));
    }));

  queries.push(Scripture
    .query('orderBy','created_at','desc')
    .query('limit', 1)
    .fetch());

  Promise.all(queries)
    .then( ([albums,posts,scripture]) => {
      albums = albums.toJSON().map( album => {
        album.type = 'Album';
        return album;
      });

      posts = posts.map( post => {
        post.type = 'Post';
        return post;
      });

      const recents = combineRecents(albums,posts).slice(0,RECENT_POST_COUNT);

      res.render('home',getContext('Home', req, {recents, scripture: scripture.toJSON()}));
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