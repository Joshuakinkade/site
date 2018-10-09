export const getAlbums = () => {
  if (module) {
    console.log('Running on node');
  } else if (window) {
    console.log("running in browser");
  }
}