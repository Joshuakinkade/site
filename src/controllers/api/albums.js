import logger from '../../logger';
import * as albums from '../../models/albums';

export const listAlbums = (req,res) => {
  albums.getAll()
    .then( albums => res.send(albums))
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    });
}

export const getAlbum = (req, res) => {
    albums.getById(req.params.albumId).then( album => {
      res.send(album);
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    })
}

export const createAlbum = (req,res) => {
  albums.create(req.body)
    .then( (model) => {
      res.send(`created album with id: ${model.id}`);
    })
    .catch( err => {
      let status = 500;
      const message = err.message;

      if (err.code === 'ER_DUP_ENTRY') {
        status = 400;
      } else if (err.code === 'ER_NOT_VALID') {
        status = 400;
      }

      logger.error(message);
      res.status(status).send(err.message);
    });
};

export const updateAlbum = (req, res) => {
  albums.update(req.params.albumId, req.body)
  .then( () => {
    res.send('ok');
  })
  .catch( err => {
    let status = 500;
    const message = err.message;

    if (err.code === 'ER_NOT_FOUND') {
      status = 404;
    }

    logger.error(message);
    res.status(status).send(err.message);
  });
}