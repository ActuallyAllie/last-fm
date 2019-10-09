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

modules.exports = {
    connect
};
