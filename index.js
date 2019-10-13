const fs = require('fs');
const dotenv = require('dotenv');
const stringify = require('csv-stringify');
const db = require('./db');
const api = require('./api');

dotenv.config();

const years = {};

async function getPage(page) {
    const data = await api.getTopAlbums(page);
    const topAlbums = data.topalbums.album;
    for (let topAlbum of topAlbums) {
        if (topAlbum.playcount < 10) {
            break;
        }
        let album = null;
        album = await db.getAlbum(topAlbum.mbid, topAlbum.url);
        if (album === null) {
            const newAlbum = {
                mbid: topAlbum.mbid || null,
                artist: topAlbum.artist.name,
                name: topAlbum.name,
                year: null,
                label: null,
                image: topAlbum.image[2]['#text'],
                url: topAlbum.url,
            };
            if (topAlbum.mbid) {
                console.log(
                    `Getting info for ${topAlbum.artist.name} - ${
                        topAlbum.name
                    }`
                );
                const info = await api.getAlbumInfo(topAlbum.mbid);
                newAlbum.year = info['release-group'][
                    'first-release-date'
                ].substring(0, 4);
                if (
                    info['label-info'] &&
                    info['label-info'][0] &&
                    info['label-info'][0].label
                ) {
                    newAlbum.label = info['label-info'][0].label.name;
                }
            }
            await db.insertAlbum(newAlbum);
            album = newAlbum;
        }
        if (years[album.year]) {
            years[album.year].push({
                ...album,
                playcount: topAlbum.playcount,
            });
        } else {
            years[album.year] = [
                {
                    ...album,
                    playcount: topAlbum.playcount,
                },
            ];
        }
    }
    return topAlbums[topAlbums.length - 1].playcount;
}

db.connect()
    .then(async () => {
        let page = 1;
        while (true) {
            console.log(`Getting page ${page}`);
            const playcount = await getPage(page);
            if (playcount < 10) {
                break;
            }
            page++;
        }
        let csv = [['Artist', 'Album', 'Year', 'Label', 'PlayCount']];
        Object.keys(years).forEach(year => {
            console.log(`\n${year}\n`);
            years[year].forEach(album => {
                console.log(
                    `${album.artist} - ${album.name} - ${album.playcount}`
                );
                csv.push([album.artist,album.name,album.year,album.label,album.playcount]);
            });
        });
        csv = await new Promise((resolve, reject) => {
            stringify(csv, (err, output) => {
                if (err) return reject(err);
                resolve(output);
            });
        })
        fs.writeFileSync('./topAlbums.csv', csv, { encoding: 'utf-8' });
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
