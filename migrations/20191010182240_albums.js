exports.up = function(knex) {
    return knex.schema.createTable('albums', function(table) {
        table.string('mbid');
        table.string('artist');
        table.string('name');
        table.string('year');
        table.string('label');
        table.string('image');
        table.string('url');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('albums');
};
