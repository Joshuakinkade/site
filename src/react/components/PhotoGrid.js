import React from 'react';

const PhotoGrid = (props) => {
  return (
    <div className="photo-grid">
      {props.children}
    </div>
  )
}

export default PhotoGrid;