import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Battle, Monster, MonsterBattle } from '../models';

const list = async (req: Request, res: Response): Promise<Response> => {
  const battles = await Battle.query();
  return res.status(StatusCodes.OK).json(battles);
};


const start = async (req: Request, res: Response): Promise<Response> => {
  const { monsterA, monsterB } = req.body;
  //validate monsterA and monsterB are defined
  if (!monsterA || !monsterB) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Both monsters must be defined' });
  }
  //validate monsterA exist in db
  const monsterAInstance = await Monster.query().findById(monsterA);
  if (!monsterAInstance) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Monster A not found' });
  }
  //validate monsterB exist in db
  const monsterBInstance = await Monster.query().findById(monsterB);
  if (!monsterBInstance) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Monster B not found' });
  }

  try {
    const winner = figth(monsterAInstance, monsterBInstance);
    if (!winner) {
      return res.status(StatusCodes.OK).json({ message: 'Draw' });
    }

    const battle: Battle = await Battle.query().insert({
      monsterA: monsterAInstance,
      monsterB: monsterBInstance,
      winner: winner,
    });

    //add the battle to the monsters
    await monsterAInstance.$relatedQuery<Battle>('battles').relate(battle);
    await monsterBInstance.$relatedQuery<Battle>('battles').relate(battle);

    //return the battle with the winner
    return res.status(StatusCodes.CREATED).json(battle);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

function figth(monsterAInstance: Monster, monsterBInstance: Monster): Monster | null{
  let turn = 1;
  let winner = null;
  let [first, second] = [monsterAInstance, monsterBInstance];
  if (monsterAInstance.speed === monsterBInstance.speed)
    [first, second] = monsterAInstance.attack > monsterBInstance.attack ? [monsterAInstance, monsterBInstance] : [monsterBInstance, monsterAInstance];
  else
    [first, second] = monsterAInstance.speed > monsterBInstance.speed ? [monsterAInstance, monsterBInstance] : [monsterBInstance, monsterAInstance];
  const damageFirst = first.attack - second.defense > 0 ? first.attack - second.defense : 1;
  const damageSecond = second.attack - first.defense > 0 ? second.attack - first.defense : 1;

  while (first.hp > 0 && second.hp > 0) {
    console.log(`Turn ${turn} - ${first.name} attacks ${second.name} with ${damageFirst} damage. ${second.name} has ${second.hp} hp left before attack`);
    if (second.hp - damageFirst <= 0) {
      winner = first;
      console.log(`${second.name} is dead. ${first.name} is the winner`);
      break;
    }
    second.hp -= damageFirst;
    turn++;
    
    console.log(`Turn ${turn} - ${second.name} attacks ${first.name} with ${damageSecond} damage. ${first.name} has ${first.hp} hp left before attack`);
    if (first.hp - damageSecond <= 0) {
      winner = second;
      console.log(`${first.name} is dead. ${second.name} is the winner`);
      break;
    }
    first.hp -= damageSecond;
    turn++;
  }

  return winner;
}

const remove = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const battle = await Battle.query().findById(id);
    if (!battle) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Battle not found' });
    }
    await battle.$query().delete();

    const deletedMonsterBattle = await MonsterBattle.query().where('battleId', id).delete();
    console.log(`deletedMonsterBattle: ${deletedMonsterBattle}`);
    return res.status(StatusCodes.NO_CONTENT).send();
  }
  catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }    
}

export const BattleController = {
  list,
  start,
  remove
};


