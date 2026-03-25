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
- sessions to of muplite users
- filter tracking
- editing opacity

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

## Problems issues know constraints

- you can only add one filter at a time per request.
- I will need to rewrite the addFilter handler to is a bit more readable
