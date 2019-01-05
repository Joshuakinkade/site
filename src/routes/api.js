import {Router} from 'express';
import passport from 'passport';
import multer from 'multer';

import * as albums from '../controllers/api/albums';
import * as photos from '../controllers/api/photos';
import * as posts from '../controllers/api/posts';
import * as scripture from '../controllers/api/scripture';

const storage = multer.memoryStorage();
const upload = multer({buffer: storage});

const apiRoutes = new Router();

// Configure HTTP Basic Authentication
apiRoutes.use(passport.authenticate('basic', {session:false}));

// Album routes
apiRoutes.get('/albums', albums.listAlbums);
apiRoutes.post('/albums', upload.single(), albums.createAlbum);
apiRoutes.get('/albums/:albumId', albums.getAlbum);
apiRoutes.put('/albums/:albumId', upload.single(), albums.updateAlbum);

// Photo routes
apiRoutes.get('/albums/:albumId/photos', photos.listPhotos);
apiRoutes.post('/albums/:albumId/photos', upload.single('photo'), photos.addPhoto);
apiRoutes.put('/albums/:albumId/photos/:photoId', upload.single(), photos.updatePhotoInfo);

// Blog routes
apiRoutes.post('/blog', upload.single('post'), posts.addPost);

// Scripture Routes
apiRoutes.post('/scripture', upload.single(), scripture.postScripture);

apiRoutes.use((req, res) => {
  res.status(404).send('Not Found');
});

export default apiRoutes;