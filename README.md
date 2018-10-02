# Tic-Tac-Toe

## Installation instructions

To install dependencies, open your terminal to the project root and run `npm install`.

## Compiling Assets

Edit assets **only** in the `src/` directory. Run `npm run dev` to compile assets into the `dist/` directory. This script executes the following:

1. Sass code in `src/sass/main.scss` is compiled into CSS in `dist/css/main.css`.
2. All HTML files in `src/` are copied (without change) into analogous folders in `dist/`.
3. Browser-sync starts a server and serves the site from `dist/`.

## Publishing instructions

1. Test project with express by running `node index.js` and checking out [localhost:3000](http://localhost:3000).
2. If all looks well, `git push heroku master`.
3. View app on heroku at [https://tic-tac-toe-bp.herokuapp.com/](https://tic-tac-toe-bp.herokuapp.com/).
