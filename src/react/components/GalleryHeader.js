import React from 'react';
import { DateTime } from 'luxon';

const GalleryHeader = (props) => {
  const album = props.album;
  
  const oneDay = +album.start_date === +album.end_date;
  let dateString = album.start_date.toLocaleString(DateTime.DATE_FULL);
  if (!oneDay) {
    dateString += ' - ' + album.end_date.toLocaleString(DateTime.DATE_FULL);
  }

  return (
    <header className="gallery-header {^album.coverPhoto}dark{/album.coverPhoto}">
      {album.coverPhoto ?
        <div className="background">
          <div className="photo">
            <div className="photo-outer short">
              <div className="photo-inner">
                <img src={`/pictures/${album.slug}/mid/${album.coverPhoto.filename}`}/>
              </div>
            </div>
          </div>
          <div className="gradient">
          </div>
        </div> : ''}
      <div className="text">
        <div className="title">
          <h1>{album.name}</h1>
          <div className="subtitle">
          {dateString}
          </div>
        </div>
      </div>
    </header>
  );
}

export default GalleryHeader;