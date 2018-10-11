import React from 'react';

const PhotoBlock = (props) => {
  const photo = props.photo;
  const album = props.album;
  return (
    <div className="tile">
      <a href={`/pictures/${album.slug}/full/${photo.filename}`}
        className="photo-link"
        data-size={`${photo.height}x${photo.width}`}
        data-caption={`${photo.caption}`}>
        <div className="photo-block">
          <div className="photo-outer">
            <div className="photo-inner">
              <img src={`/pictures/${album.slug}/thumb/${photo.filename}`} />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default PhotoBlock;