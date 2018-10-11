import React, {Component} from 'react';
import {getAlbum, getPhotos} from '../../lib/api';

import GalleryHeader from '../components/GalleryHeader';
import PhotoGrid from '../components/PhotoGrid';
import PhotoBlock from '../components/PhotoBlock';

export default class AlbumPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      album: null,
      photos: [],
      view: 'grid',
      editing: false,
      error: null
    };

  }

  componentDidMount() {
    let pageAlbum;
    getAlbum(1)
      .then( album => {
        pageAlbum = album; 
        return getPhotos(1);
      })
      .then( photos => {
        this.setState({album: pageAlbum, photos, error: null});
      })
      .catch( err => {
        this.setState({error: err});
      });
  }

  render() {
    return this.state.album ?
    (<div className="AlbumPage">
      <GalleryHeader album={this.state.album}/>
      <main>
        <div className="headline">
          <p>{this.state.album.description}</p>
        </div>
        <PhotoGrid>
          {this.state.photos.map( photo => 
            <PhotoBlock photo={photo} album={this.state.album} key={photo.id}/>
          )}
        </PhotoGrid>
      </main>
    </div>) : '';
  }
}