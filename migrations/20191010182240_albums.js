exports.up = function(knex) {
    knex.schema.table('albums', function(table) {
        table.string('mbid');
        table.string('artist');
        table.string('name');
        table.string('year');
        table.string('label');
        table.string('image');
    });
};

exports.down = function(knex) {
    knex.schema.dropTable('albums');
};
