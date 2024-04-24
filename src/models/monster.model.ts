import { Id, RelationMappings } from 'objection';
import Base from './base';
import { Battle } from './battle.model';

export class Monster extends Base {
  id!: Id;
  name!: string;
  attack!: number;
  defense!: number;
  hp!: number;
  speed!: number;
  imageUrl!: string;
  battles?: Battle[];

  static tableName = 'monster';

  static get relationMappings(): RelationMappings {
    return {
      battles: {
        relation: Base.ManyToManyRelation,
        modelClass: Battle,
        join: {
          from: 'monster.id',
          through: {
            from: 'monster_battle.monsterId',
            to: 'monster_battle.battleId',
          },
          to: 'battle.id',
        },
      },
    };
  }
}
