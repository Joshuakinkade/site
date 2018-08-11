import {Scripture} from '../models/bookshelf';
import logger from '../logger';

export const postScripture = (req, res) => {
  if (!req.body.text || !req.body.reference) {
    return res.status(400).send('Scripture is not valid');
  }

  const scripture = new Scripture({
    text: req.body.text,
    reference: req.body.reference
  });

  scripture.save()
    .then( () => {
      res.send('ok');
    })
    .catch( err => {
      logger.error(err.message);
      res.status(500).send(err.message);
    });
};