import {DateTime} from 'luxon';
import {Album} from './bookshelf';
import {getSlug} from '../lib/helpers';

export const getAll = () => Album.fetchAll().then( albums => albums.toJSON());

export const getById = (albumId) => {
  return Album
    .where('id', albumId)
    .where('deleted_at', null)
    .fetch({withRelated: 'coverPhoto'})
    .then( album => album.toJSON());
}

export const create = (data) => {
  const albumSlug = getSlug(data.name);
  const start =  DateTime.fromISO(data.startDate);
  const end = DateTime.fromISO(data.endDate);

  if (!start.isValid) {
    const err = new Error('Start date not valid');
    err.code = 'ER_NOT_VALID';
    throw err;
  }

  if (!end.isValid) {
    const err = new Error('End date not valid');
    err.code = 'ER_NOT_VALID';
    throw err;
  }

  const album = new Album({
    name: data.name,
    slug: albumSlug,
    start_date: start,
    end_date: end,
    description: data.description || null
  });

  return album.save()
}

export const update = (albumId, data) => {
  return Album.where('id', albumId).fetch()
  .then( album => {
    if (!album) {
      const err = new Error(`Album with id ${albumId} does not exist`);
      err.code = 'ER_NOT_FOUND';
      throw err;
    }

    const newData = Object.assign({}, data);

    // Copy properties from the request body to the album
    for (const key in newData) {
      if (newData.hasOwnProperty(key)) {
        const value = newData[key];
        album.set(key,value);
      }
    }

    return album.save();
  });
}