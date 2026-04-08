# image-processor

- This project allow you to upload image and edit them and download the result

## Stack

- languages JavaScript HTML CSS
- Deno

## Requirements

- Install deno
- Run `iwr https://deno.land/install.ps1 -useb | iex` (windows)

## Features

- PNG image decoding (only rgb and rgba types supported)
- Pixels to canvas to file
- Sessions to of muplite users
- Filter tracking
- Image downloading

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
├── plan.md
├── README.md
│
├── .vscode
│   └── settings.json
│
├── data
│   ├── database
│   │
│   └── images
│       ├── car.png
│       ├── dog.png
│       │
│       ├── input
│       │   └── .gitkeep
│       │
│       └── output
│           └── .gitkeep
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
    │   ├── filters.js
    │   ├── image-editor.js
    │   ├── image.js
    │   └── sessions.js
    │
    ├── middleware
    │   └── serveStatic.js
    │
    ├── public
    │   ├── index.html
    │   ├── style.css
    │   │
    │   ├── assets
    │   │   ├── favicon.png
    │   │   └── .gitkeep
    │   │
    │   └── scripts
    │       ├── editor-init.js
    │       ├── image-download.js
    │       ├── setup-session.js
    │       └── silders-values.js
    │
    ├── routes
    │   └── index.js
    │
    ├── services
    │   ├── image.js
    │   ├── render-image-output.js
    │   ├── sessions.js
    │   │
    │   ├── image-filters
    │   │   ├── apply-filters.js
    │   │   ├── filters-validation.js
    │   │   └── filters.js
    │   │
    │   └── png-decoder
    │       ├── apply-png-filters.js
    │       ├── check-crc.js
    │       ├── chunk-parser.js
    │       ├── decompress-bytes.js
    │       └── png-decoder-filters.js
    │
    ├── utils
    │   ├── file.js
    │   ├── merge-two-uint8-arrays.js
    │   ├── pixels.js
    │   └── responses.js
    │
    └── views
        ├── download-image.js
        ├── filters.js
        ├── image-editor.js
        ├── image-input.js
        └── image-output.js
```

## Key logic flow

# PNG Decoder Overview

- **Chunk Parser**
- Split bytes into PNG chunks: `length`, `type`, `data`, `CRC`
- Parse each chunk based on type (`IHDR`, `IDAT`, `IEND`)
- Concatenate `IDAT` chunks to build compressed image stream

- **CRC32 Validator**
  - Compute CRC32 on chunk type + data
    - Starts with 32 bits of 1s `0xFFFFFFFF`
    - XOR with `byte`
    - Shift to the right 8 time each time if dropped byte is a 1 XOR with
      `0xEDB88320`
    - XOR with `0xFFFFFFFF` at end
  - Compares with chunk CRC to check for corruption

- **Decompression**
- Deflate decompress the concatenated pixel stream (`pipeThrough(ds)`)
  - Returns unfiltered image bytes + metadata

- **How the filters work**
  - Apply filters to decompressed, unfiltered scanlines
  - Read filter type byte at start of each row `filterType = row[0]`
  - None: row unchanged
  - Sub: add left pixel
  - Up: add above pixel
  - Average: adds mean of left and above
  - Paeth: adds closest of (left, above, leftAbove) to the predictor
    `valueLeft + valueAbove - valueLeftAbove`

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
- **image cropping**
  - Calculates which pixels should be removed
  - For left and right cropping calculates distance from the edge
    `Xplacment = i % imageData.width`
  - Effect: Removes outer edges of image

## Problems issues know constraints

- You can't have different images on same browser
- You can't chagne image without closing browser and restarting
