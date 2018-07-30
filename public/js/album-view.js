const pswp = document.querySelector('.pswp');

const photos = $('.photo-link')
  .map( (i,item) => {
    $(item).on('click', function(evt) {
      evt.preventDefault();
      openGallery(i);
    });

    const size = $(item).attr('data-size').split('x');

    return {src: $(item).attr('href'), h: size[0], w: size[1]};
  }).toArray();


function openGallery(index) {
  const options = {
    index: index
  };
  const gallery = new PhotoSwipe(pswp, PhotoSwipeUI_Default, photos, options);
  gallery.init();
}

