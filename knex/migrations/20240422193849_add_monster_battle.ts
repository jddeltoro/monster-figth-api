import { Knex } from "knex";
import { MonsterBattle } from '../../src/models';

export const up = (knex: Knex): Promise<void> =>
    knex.schema.createTable(MonsterBattle.tableName, (table: Knex.TableBuilder) => {
        table.integer('monsterId').unsigned().notNullable();
        table.integer('battleId').unsigned().notNullable();
        table.foreign('monsterId').references('monster.id');
        table.foreign('battleId').references('battle.id');
    });



export const down = (knex: Knex): Promise<void> =>
    knex.schema.dropTable(MonsterBattle.tableName);


