const Knex = require('knex');

const knex = Knex({
    client: 'sqlite3',
    connection: {
        filename: 'last-fm.sqlite',
    },
});

async function connect() {
    await knex.migrate.latest({
        directory: './migrations',
        tableName: 'migrations',
    });
}

async function getAlbum(mbid, url) {
    const albums = await knex('albums')
        .select()
        .where('mbid', mbid)
        .orWhere('url', url);
    return albums.length ? albums[0] : null;
}

async function insertAlbum(album) {
    return knex('albums').insert(album);
}

module.exports = {
    connect,
    getAlbum,
    insertAlbum,
};
