import React, {Component} from 'react';
import {getAlbum, getPhotos} from '../../lib/api';

import GalleryHeader from '../components/GalleryHeader';
import PhotoGrid from '../components/PhotoGrid';
import PhotoBlock from '../components/PhotoBlock';

export default class AlbumPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'grid',
      editing: false
    };

    if (props.initialState) {
      this.state.album = props.initialState.album;
      this.state.photos = props.initialState.photos;
      this.state.error = props.initialState.error;
    } else {
      this.state.album = null;
      this.state.photos = [];
      this.state.error = null;
    }
  }

  componentDidMount() {
    let pageAlbum;
    getAlbum(this.props.albumId)
      .then( album => {
        pageAlbum = album;
        return getPhotos(this.props.albumId);
      })
      .then( photos => {
        this.setState({album: pageAlbum, photos, error: null});
      })
      .catch( err => {
        console.log(JSON.stringify(err));
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
    </div>) : <div>No Ablum Loaded</div>;
  }
}