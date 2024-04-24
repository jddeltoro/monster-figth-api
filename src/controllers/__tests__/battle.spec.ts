import app from '../../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

const server = app.listen();

beforeAll(() => jest.useFakeTimers());
afterAll(() => server.close());

describe('BattleController', () => {
  describe('List', () => {
    test('should list all battles', async () => {
      const response = await request(server).get('/battle');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Battle', () => {
    test('should fail when trying a battle of monsters with an undefined monster', async () => {
      const response = await request(server).post('/battle/start').send({
        monsterA: 1,
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test('should fail when trying a battle of monsters with an inexistent monster', async () => {
      const response = await request(server).post('/battle/start').send({
        monsterA: 1,
        monsterB: 9999,
      });
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    test('should insert a battle of monsters successfully with monster 1 winning', async () => {
        const response = await request(server).post('/battle/start').send({
          monsterA: 2,
          monsterB: 1,
        });
        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body.winner.id).toBe(2);
    });

    test('should insert a battle of monsters successfully with monster 2 winning', async () => {
      const response = await request(server).post('/battle/start').send({
          monsterA: 1,
          monsterB: 2,
        });
        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body.winner.id).toBe(2);
      });
  });

  describe('Delete Battle', () => {
    test('should delete a battle successfully', async () => {
      const battleId = 1; // Assuming 1 is an existing battle ID
      const response = await request(server).delete(`/battle/${battleId}`);
      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    test("should return 404 if the battle doesn't exists", async () => {
      const battleId = 9999; // Assuming 9999 is a non-existent battle ID
      const response = await request(server).delete(`/battle/${battleId}`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
