import React from 'react';
import ReactDom from 'react-dom';
import AlbumPage from './containers/AlbumPage';

const root = document.getElementById('app-root');
const albumId = root.getAttribute('data-album-id');

ReactDom.render(<AlbumPage albumId={albumId}/>, root);