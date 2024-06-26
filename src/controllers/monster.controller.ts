import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DBError, Id, NotNullViolationError } from 'objection';
import { Monster } from '../models';
import csv from 'csvtojson';
import { readFileSync } from 'fs';

export const get = async (req: Request, res: Response): Promise<Response> => {
  const id: Id = req.params.id;
  const monster = await Monster.query().findById(id);
  if (!monster) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }
  return res.status(StatusCodes.OK).json(monster);
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const monster = await Monster.query().insert(req.body);
  return res.status(StatusCodes.CREATED).json(monster);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;
  const monster = await Monster.query().findById(id);
  if (!monster) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }
  monster.$query().patch(req.body);
  return res.sendStatus(StatusCodes.OK);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;
  const monster = await Monster.query().findById(id);
  if (!monster) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }
  monster.$query().delete();
  return res.sendStatus(StatusCodes.NO_CONTENT);
};

export const importCsv = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const content = readFileSync(req.file!.path, { encoding: 'utf-8' });
  const data = await csv().fromString(content);
  try {
    await Monster.query().insertGraph(data);
  } catch (e) {
    if (e instanceof NotNullViolationError || e instanceof DBError) {
      const message = 'Wrong data mapping.';
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }
  }
  return res.sendStatus(StatusCodes.CREATED);
};

export const getAll = async (req: Request, res: Response): Promise<Response> => {
  const monsters = await Monster.query();
  return res.status(StatusCodes.OK).json(monsters);
};

export const search = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const name: string = req.params.name;
  const monsters = await Monster.query().where('name', 'like', `%${name}%`);
  return res.status(StatusCodes.OK).json(monsters);
};

export const clone = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;
  const monster = await Monster.query().findById(id);
  if (!monster) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }
  const clone = await Monster.query().insertAndFetch({ ...monster, name: `${monster.name} (clone)` });
  return res.status(StatusCodes.CREATED).json(clone);
}

export const special_ability = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;
  const monster = await Monster.query().findById(id);
  if (!monster) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  } 
  const specialAbility = await monster.$relatedQuery('special_abilities');
  return res.status(StatusCodes.OK).json(specialAbility);
}

export const add_talent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;
  const monster = await Monster.query().findById(id);
  if (!monster) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }

  const talent = req.body;
  const newTalent = await monster.$relatedQuery('talents').insert(talent);
  return res.status(StatusCodes.CREATED).json(newTalent);
}

export const  add_item = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;
  const monster = await Monster.query().findById(id);
  if
  (!monster) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }
  const item = req.body;
  const newItem = await monster.$relatedQuery('items').insert(item);
  return res.status(StatusCodes.CREATED).json(newItem);
}


export const MonsterController = {
  get,
  create,
  update,
  remove,
  importCsv,
  getAll,
  search,
  clone,
  special_ability,
  add_talent
};
