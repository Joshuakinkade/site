import React from 'react';
import {Link} from 'react-router-dom';

const PhotoBlock = (props) => {
  const photo = props.photo;
  const album = props.album;
  return (
    <div className="tile">
      <Link to={`/pictures/${album.slug}/${photo.filename}`} className="photo-link">
        <div className="photo-block">
          <div className="photo-outer">
            <div className="photo-inner">
              <img src={`/pictures/${album.slug}/thumb/${photo.filename}`} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PhotoBlock;