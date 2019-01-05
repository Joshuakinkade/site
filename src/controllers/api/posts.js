import {DateTime} from 'luxon';
import logger from '../../logger';
import {Post} from '../../models/bookshelf';
import {getSlug} from '../../lib/helpers';
import PostParser from '../../lib/post-parser';

export const addPost = (req, res) => {
  const postText = req.file.buffer.toString('utf8');

  const parser = new PostParser(postText);
  try {
    const postData = parser.parse();

    const postDate = postData.metadata.date ? DateTime.fromISO(postData.metadata.date) : DateTime.utc();
    if (!postData.metadata.hasOwnProperty('title')) {
      throw new Error('A title is required');
    } 

    const post = new Post({
      title: postData.metadata.title,
      slug: getSlug(postData.metadata.title),
      post_date: postDate,
      headline: postData.metadata.headline || null,
      text: postData.text
    });

    post.save()
      .then( () => {
        res.status(200).send('ok');
      })
      .catch( err => {
        if (err.code == 'ER_DUP_ENTRY') {
          return res.status(400).send('Post title is taken. Choose another one');
        }
        logger.error(err.message);
        return res.status(500).send(err.message);
      })
  } catch(err) {
    res.status(400).send(err.message);
  }
}