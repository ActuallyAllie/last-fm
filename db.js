const Knex = require('knex');
const Knex = require('knex');

const knex = Knex({
    client: 'sqlite3',
    connection: {
        filename: 'last-fm.sqlite'
    }
});

async function connect() {
    await knex.migrate.latest({
        directory: './migrations',
        tableName: 'migrations'
    });
}

async function getAlbum(mbid) {
    const albums = await knex('albums').select().where('mbid', mbid);
    return albums.length ? albums[0] : null;
}

async function insertAlbum() {

}

modules.exports = {
    connect
};
