import {Block, rawSQL} from './bookshelf';

export const getForAlbum = (albumId) => {
  return Block
    .where('album', albumId)
    .where('deleted_at', null)
    .fetchAll({withRelated: 'photo'})
    .then( blocks => blocks.toJSON());
}

export const create = (albumId, data) => {
  const block = new Block({
    album: albumId,
    type: 'photo',
    order: data.order || 1,
    photo: data.photo,
    text: data.text,
    height: data.height || 1,
    width: data.width || 1
  });

  return block.save()
    .then( block => block.toJSON());
}

export const update = (blockId, data) => {
  return Block
    .where('id', blockId)
    .where('updated_at', null)
    .fetch()
    .then( block => {
      if (!block) {
        throw new Error('Block not found');
      }

      // Copy properties from the request body to the block
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          block.set(key,value);
        }
      }

      return block.save()
    });
}

export const remove = (blockId) => {
  return Block.where('id', blockId).fetch()
    .then( block => {
      block.set('deleted_at', rawSQL('CURRENT_TIMESTAMP()'));
      return block.save();
    })
}