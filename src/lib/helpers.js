export function getSlug(str) {
  return str
    .replace(/\s+\-\s+/,'-') // Replace a dash surrounded by whitespace with a dash, to avoid multiple dashes
    .replace(/[\s_]/g,'-') // Replace whitespace and underscores with dashes
    .replace(/[^\w.-]/g,'') // Remove all none word characters and dashes 
    .toLowerCase();
}

export function combineRecents(albums,posts) {
  let recents = [];

  let ai = 0;
  let pi = 0;

  // While there are entries in both arrays
  while( ai < albums.length && pi < posts.length) {
    const album = albums[ai];
    const post = posts[pi];

    // Put the next most recent entry into recents
    if (album.start_date <= post.post_date) {
      recents.push(album);
      ai++;
    } else {
      recents.push(post);
      pi++;
    }
  }

  // Put any remaining entries into recents
  if (ai === albums.length && pi < posts.length) {
    recents = recents.concat(posts.slice(pi));
  } else if (ai < albums.length && pi === posts.length) {
    recents = recents.concat(albums.slice(ai));
  }

  return recents;
}