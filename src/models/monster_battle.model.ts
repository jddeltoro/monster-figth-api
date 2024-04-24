import { Id, RelationMappings } from 'objection';
import Base from './base';
import { Monster } from './monster.model';
import { Battle } from './battle.model';

export class MonsterBattle extends Base {
    monsterId!: Id;
    battleId!: Id;
    monster!: Monster;
    battle!: Battle;

    static tableName = 'monster_battle';

    static get relationMappings(): RelationMappings {
        return {
            monster: {
                relation: Base.BelongsToOneRelation,
                modelClass: Monster,
                join: {
                    from: 'monster_battle.monsterId',
                    to: 'monster.id',
                },
            },
            battle: {
                relation: Base.BelongsToOneRelation,
                modelClass: Battle,
                join: {
                    from: 'monster_battle.battleId',
                    to: 'battle.id',
                },
            },
        };
    }
}