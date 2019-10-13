const axios = require('axios');

//?method=user.gettopalbums&user=rj&api_key=YOUR_API_KEY&format=json'
const lastFmUrl = 'http://ws.audioscrobbler.com/2.0/';

//http://musicbrainz.org/ws/2/release/59211ea4-ffd2-4ad9-9a4e-941d3148024a?inc=release-groups
const musicBrainzUrl = 'http://musicbrainz.org/ws/2';
const musicBrainzHeaders = {
    'Accept': 'application/json',
    'User-Agent': 'TheKiteEatingTree/0.1.0'
};

async function getAlbumInfo(mbid) {
    // don't want to hit musicbrainz api load limits
    await new Promise(resolve => setTimeout(() => resolve(), 1000));
    try {
        const response = await axios.get(`${musicBrainzUrl}/release/${mbid}`, {
            headers: musicBrainzHeaders,
            params: {
                inc: 'release-groups+labels'
            }
        });
        return response.data;
    } catch (err) {
        console.error(err);
    }
}

async function searchForAlbumInfo(release) {
    try {
        const response = await axios.get(`${musicBrainzUrl}/release/`, {
            headers: musicBrainzHeaders,
            params: {
                query: `release:${release}`,
            }
        });
        return response.data;
    } catch (err) {
        console.error(err);
    }
}

async function getTopAlbums(page = 1) {
    try {
        const response = await axios.get(lastFmUrl, {
            params: {
                page,
                user: process.env.LAST_FM_USER,
                api_key: process.env.LAST_FM_API_KEY,
                method: 'user.gettopalbums',
                format: 'json',
                limit: 250
            }
        });
        return response.data;
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    getAlbumInfo,
    getTopAlbums,
    searchForAlbumInfo,
};
