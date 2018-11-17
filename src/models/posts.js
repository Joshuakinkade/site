import {Post} from './bookshelf';

export const getRecent = ({count}) => {
  const query = Post.query('orderBy', 'created_at', 'desc');
  if (count) {
    query.query('limit', count);
  }

  return query.fetchAll({withRelated: 'coverPhoto'});
};