import db from './db';
import { DateTime } from 'luxon';

export const getAlbums = () => {
  return db.getConnection()
    .select()
    .from('albums')
    .where('deleted_at',null)
    .orderBy('start_date','desc')
    .then( albums => albums.map( a => hydrateAlbum(a)));
}

const hydrateAlbum = (albumData) => {
  const album = Object.assign({},albumData);
  album.start_date = new DateTime(album.start_date);
  album.end_date = new DateTime(album.end_date);
  return album;
}