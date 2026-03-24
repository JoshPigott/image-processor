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

## File structure

```text
├── deno.json
├── deno.lock
├── README.md
├── dog.png
├── yellow.png
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
    │   │
    │   └── assets
    │       ├── dog.png
    │       ├── dog.ppm
    │       ├── yellow.png
    │       └── yellow.ppm
    │
    ├── routes
    │   └── index.js
    │
    ├── services
    │   ├── filters.js
    │   ├── get-image-data.js
    │   ├── make-canvas.js
    │   └── session.js
    │
    └── utils
        └── json.js
```

## Key logic flow

- Coming soon

Filters of in the database link to the session. Filters row are per image.

## Problems issues know constraints

- you can only add one filter at a time per request.
- I will need to rewrite the addFilter handler
