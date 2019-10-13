# last-fm
Top albums by year from last.fm

## Usage

1. Copy `./env.example` to `./.env` and edit the values to your last.fm api key and last.fm user name.
2. Run `node index.js` - Subsequent runs are much faster since results are cached in sqlite database.
3. Results are output by year in the terminal by year
4. `./topAlbums.csv` is written with results
4. Albums are saved in `./last-fm.sqlite` database - if you edit the year or labels in this database for albums that are not pulled correctly and re-run the results will show your edits.
