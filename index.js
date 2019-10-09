const dotenv = require('dotenv');
// const db = require('./db');
const api = require('./api');

dotenv.config();

api.getTopAlbums('KiteEatingTree').then(async data => {
    const albums = data.topalbums.album;
    const years = {};
    for (let album of albums) {
        console.log(`Getting info for ${album.artist.name} - ${album.name}`);
        let year = '0000';
        let info = null;
        if (album.mbid) {
            info = await api.getAlbumInfo(album.mbid);
        } else {
            info = await api.searchForAlbumInfo(album.name);
            if (info.releases[0]) {
                const release = info.releases[0];
                info = await api.getAlbumInfo(release.id);
            }
        }
        if (info) {
            year = info['release-group']['first-release-date'].substring(0, 4);
        }
        await new Promise(resolve => setTimeout(() => resolve(), 1000));
        if (years[year]) {
            years[year].push(album);
        } else {
            years[year] = [album];
        }
    }
    Object.keys(years).forEach(year => {
        console.log(`\n${year}\n`);
        years[year].forEach(album => {
            console.log(`${album.artist.name} - ${album.name} - ${album.playcount}`);
        });
    });
});
