import {DateTime} from 'luxon';

export const getAlbum = (albumId) => {
  return makeRequest(`/api/albums/${albumId}`)
    .then( album => {
      album.start_date = DateTime.fromISO(album.start_date);
      album.end_date = DateTime.fromISO(album.end_date);
      return album;
    });
}

export const getPhotos = (albumId) => {
  return makeRequest(`/api/albums/${albumId}/photos`)
    .then( photos => photos.map( photo => {
      photo.date_taken = DateTime.fromISO(photo.date_taken);
      return photo;
    }));
}

const makeRequest = (url) => {
  // TODO: Don't hard code credentials.
  const headers = new Headers();
  headers.append('Authorization', 'Basic am9zaDpwYXNzd29yZA==');

  return fetch(url, {headers})
    .then( response => {
      if (response.status == 200) {
        return response.json();
      } else {
        // TODO: Throw an error if the request fails.
        return null;
      }
    });
}