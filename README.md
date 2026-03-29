# image-processor

- This project allow you to upload image and edit them and download the result

## Stack

- languages JavaScript HTML CSS
- Deno

## Requirements

- Install deno
- Run `iwr https://deno.land/install.ps1 -useb | iex` (windows)

## Features

- PPM image decoding
- Pixels to canvas to file
- Sessions to of muplite users
- Filter tracking

- **Filters**
- Editing opacity
- Editing brigtness
- Editing contrast
- Editing saturation
- Editing vibrance
- Greyscale
- Rotation 90, 180, 270 degrees
- Increasing image sharpness
- Increasing image blur

## File structure

```text
├── deno.json
├── deno.lock
├── README.md
├── plan.md
│
├── .vscode
│   └── settings.json
│
├── data
│   ├── .gitkeep
│   └── database
│
└── src
    ├── server.js
    │
    ├── database
    │   ├── connection.js
    │   ├── filters.js
    │   ├── image.js
    │   ├── schema.js
    │   └── sessions.js
    │
    ├── handlers
    │   ├── image.js
    │   └── sessions.js
    │
    ├── middleware
    │   └── serveStaticFiles.js
    │
    ├── public
    │   ├── index.html
    │   ├── style.css
    │   │
    │   └── assets
    │       ├── dog.png
    │       ├── dog.ppm
    │       └── yellow.ppm
    │
    ├── routes
    │   └── index.js
    │
    ├── services
    │   ├── apply-filters.js
    │   ├── filters-validate.js
    │   ├── filters.js
    │   ├── get-image-data.js
    │   ├── make-canvas.js
    │   └── sessions.js
    │
    └── utils
        └── json.js
```

## Key logic flow

- Coming soon

Filters of in the database link to the session. Filters row are per image.

## How all the filters work

- **opacity**
  - Multiplies Alpha value by number from 0 to 1 to decrease transparency
  - Effect: Makes the image more see-through or solid
- **brightness**
  - Adds or subtracts up to 50 to each RGB value increasing or decreasing pixel
    brigtness
  - Effect: Makes image look more bright or more dull
- **contrast**
  - Find distance from midpoint of 128
  - Increases contrast by scaling the distance by up to 1.5
  - Decrease contrast by scaling the distance by up to 0.5
  - Effect: Increase or decrease difference between light and dark areas
- **greyscale**
  - Calculate a grey colour from RGB values
  - Weights green > red > blue according to perceived brightness
  - `greyscale = Math.round(0.299 * red + 0.587 * green + 0.114 * blue)`
  - Applies this grey color to each RBG value
  - Effect: Images turns black, white and grey in colour
- **saturation**
  - Finds the grey average
  - `greyAverage = Math.round((red + green + blue) / 3)`
  - With each RGB value find distance from grey average
  - Multiplies distance from grey average by (0.5 to 2.0)
  - Effect: Image colours become more bright or dull
- **vibrance**
  - Same as saturation expect distance from grey average is not multiply by
    constant value
  - `vibranceMultiplier = 1 + vibranceValue * (1 - (distanceFromGreyAverage / 255))`
  - This makes small distance from grey chagne more and large ones less
  - Effect: Same as saturation prodects things like skin tones
- **rotation 180 degrees**
  - calculates oppsite pixels to swap with
  - swaps inplace first pixel with 4th last last pixel ect
  - That keeps RGBA order
  - Effect: image rotated 180 degrees
- **rotation 90 and 270 degrees**
  - Find where pixel will be in new image adds to a new array (inplace not
    possible)
  - 90 rotation `newX = newWidth - 1 - y;` and `newY = x;`
  - 270 rotation `newX = y;` and `newY = newHeight - 1 - x;`
  - Screen coordinates reverse rotation direction so x and x formula are adjust
    to this
  - Effect: image rotated 90 or 270 degrees
- **image sharpness**
  - Looks at neighbouring pixels
  - Calculate new RGB values from pixels and neighbouring pixels rgb values
  - It increase the in RGB values from neighbouring pixels
  - Effect: increase edge definition
- **image blur**
  - Looks at neighbouring pixels
  - Uses this formula
  - `(1 - multiplier) * rgbaValue + (multiplier * 0.125) * directNeighboursSum + (multiplier * 0.0625) * diagonalNeighboursSum`
  - Effect: Removes fine details and softens edges

## Problems issues know constraints

- you can only add one filter at a time per request.
- I will need to rewrite the addFilter handler to is a bit more readable
