# Site Notes

## Todo

- fix mobile album links
- finish gallery header
- add ssl
- add facebook tags
- bulk album post route

## Context

```json
{
  "site": {
    "siteName": "joshuakinkade.me",
    "baseUrl": "https://joshuakinkade.me"
  },
  "page": {
    "title": "Home",
    "path": "/"
  },
  "ablums":["..."]
}
```

### Photo Viewer
#### Requirements
- Easy to include on multiple pages
- lazy load images
- update and read url hash
  - set hash when showing a picture
  - read hash and show appropriate picture when page loads
- allow swiping through pictures on touchscreen devices
- have previous and next buttons on either side of picture
- accept 'left' and 'right' keys to navigate
- have a close button in right side of header
- accept 'esc' key to close
- show current vs total pictures in left side of header
- dark background
- show album title and photo name centered in header
- show caption at bottom of picture in translucent gradient
  - show caption hide button on top right of caption box
  - show caption show button below photo when caption is collapsed

#### UI Components
- Photo Container: displays the selected picture
- Header: displays info close button
- Gallery Header: displays a header with a large background image, a title, subtitle, and some other info
  - params
    - bgImage?
    - title
    - subTitle?
    - extra?

#### Process for uploading an album
1. Choose pictures and export jpegs to temporary directory
2. Create Album yaml file
3. Run bulk upload script

#### Album Metadata YAML format
```yaml
name: enter unique name here
startDate: date that album begins
endDate: date that album ends
photos:
  -
    filename: name of the image file
    caption: description of the picture
```