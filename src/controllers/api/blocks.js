import {Block} from '../../models/bookshelf';
import logger from '../../logger';

export const listBlocks = (req, res) => {
  Block
    .where('album', req.params.albumId)
    .where('deleted_at', null)
    .fetchAll({withRelated: 'photo'})
    .then( blocks => {
      return res.send(blocks.toJSON());
    })
    .catch( err => {
      logger.error(err);
      res.status(500).send(err.message);
    })
}

export const addBlock = (req, res) => {
  const block = new Block({
    album: req.params.albumId,
    type: 'photo',
    order: req.body.order || 1,
    photo: req.body.photo,
    text: req.body.text,
    height: req.body.height || 1,
    width: req.body.width || 1
  });

  block.save()
    .then( model => {
      res.send(model.toJSON());
    })
    .catch( err => {
      logger.error(err);
      res.status(500).send(err.message);
    });
}

export const updateBlock = (req, res) => {
  Block
    .where('id', req.params.blockId)
    .where('updated_at', null)
    .fetch()
    .then( block => {
      if (!block) {
        throw new Error('Block not found');
      }

      const newData = Object.assign({},req.body);

      // Copy properties from the request body to the block
      for (const key in newData) {
        if (newData.hasOwnProperty(key)) {
          const value = newData[key];
          block.set(key,value);
        }
      }

      return block.save()
        .then( () => {
          res.send('ok');
        });
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    })
}

export const deleteBlock = (req ,res) => {
  Block.where('id',req.params.blockId).fetch()
    .then( block => {
      block.set('deleted_at', Date.now());
      return block.save();
    })
    .then( () => {
      res.send('ok');
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    })
}