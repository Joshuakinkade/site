// document.querySelector('site-menu button').addEventListener('click', function() {
//   console.log('hello');
// })

document.onload = function() {
  console.log("loaded");
  document.querySelector('site-menu button').addEventListener('click', function() {
    console.log('hello');
  });
}