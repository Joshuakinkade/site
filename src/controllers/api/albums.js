import {DateTime} from 'luxon';

import {Album} from '../../models/bookshelf';
import {getSlug} from '../../lib/helpers';

export const listAlbums = (req, res) => {
  Album.fetchAll({columns: ['id', 'name', 'slug']})
    .then( albums => {
      res.send(albums.toJSON());
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    });
}

export const getAlbum = (req, res) => {
  Album.where('id', req.params.albumId).fetch()
    .then( album => {
      res.send(album.toJSON());
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    });
}

export const createAlbum = (req,res) => {
  const albumSlug = getSlug(req.body.name);
  const start =  DateTime.fromISO(req.body.startDate);
  const end = DateTime.fromISO(req.body.endDate);

  if (!start.isValid) {
    return res.status(400).send('Start Date not valid');
  }

  if (!end.isValid) {
    return res.status(400).send('End Date not valid');
  }

  const album = new Album({
    name: req.body.name,
    slug: albumSlug,
    start_date: start,
    end_date: end,
    description: req.body.description || null
  });

  album.save()
    .then( (model) => {
      res.send(`created album with id: ${model.id}`);
    })
    .catch( err => {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('Album name is taken. Choose another.');
      }
      logger.error(err.message);
      res.status(500).send(err.message);
    })
};

export const updateAlbum = (req, res) => {
Album.where('id', req.params.albumId).fetch()
  .then( album => {
    if (!album) {
      return res.status(404).send(`Album with id ${req.params.albumId} does not exist`);
    }

    const newData = Object.assign({},req.body);

    // Copy properties from the request body to the album
    for (const key in newData) {
      if (newData.hasOwnProperty(key)) {
        const value = newData[key];
        album.set(key,value);
      }
    }

    return album.save()
      .then( () => {
        res.send('ok');
      });
  })
  .catch( err => {
    logger.error(err.message);
    res.status(500).send(err.message);
  });
}