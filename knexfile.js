module.exports = {
    client: 'sqlite3',
    connection: {
        filename: 'last-fm.sqlite'
    },
    migrations: {
        directory: './migrations',
        tableName: 'migrations'
    }
};
