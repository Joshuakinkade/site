import {Album,Post} from '../models/bookshelf';
import {combineRecents, getContext} from '../lib/helpers';

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
    .fetchAll());

  Promise.all(queries)
    .then( ([albums,posts]) => {
      albums = albums.toJSON().map( album => {
        album.type = 'Album';
        return album;
      });

      posts = posts.toJSON().map( post => {
        post.type = 'Post';
        return post;
      });

      const recents = combineRecents(albums,posts).slice(0,RECENT_POST_COUNT);

      res.render('home',getContext('Home', req, {recents}));
    })
    .catch( err => {
      console.error(err);
      res.render('error-page', getContext('Home', req, {error: err.message}));
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

};