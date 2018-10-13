import logger from '../../logger';
import * as blocks from '../../models/blocks';

export const listBlocks = (req, res) => {
  blocks.getForAlbum(req.params.albumId)
    .then( blocks => {
      return res.send(blocks);
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    })
}

export const addBlock = (req, res) => {
  blocks.create(req.params.albumId, req.body)
    .then( block => {
      res.send(block);
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    });
}

export const updateBlock = (req, res) => {
  blocks.update(req.params.blockId, req.body)
    .then( () => {
      res.send('ok');
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    })
}

export const deleteBlock = (req ,res) => {
  blocks.remove(req.params.blockId)
    .then( () => {
      res.send('ok');
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    });
}