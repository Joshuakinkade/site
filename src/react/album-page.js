import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {DateTime} from 'luxon';
// import AlbumPage from './containers/AlbumPage';
import App from './App';

const root = document.getElementById('app-root');
const albumId = root.getAttribute('data-album-id');

// TODO: hydrate initial state better
if (initialState.album) {
  initialState.album.start_date = DateTime.fromISO(initialState.album.start_date);
  initialState.album.end_date = DateTime.fromISO(initialState.album.end_date);
}

// ReactDom.hydrate(<AlbumPage albumId={albumId} initialState={initialState}/>, root);

ReactDom.hydrate(
  <BrowserRouter>
    <App albumId={albumId} initialState={initialState}/>
  </BrowserRouter>,
  root
);