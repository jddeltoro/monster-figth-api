import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('monster', (table) => {
        table.string('name').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('monster', (table) => {
        table.dropColumn('name');
    });
}

