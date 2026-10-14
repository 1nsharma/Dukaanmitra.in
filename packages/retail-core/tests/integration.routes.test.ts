import express from 'express';
import request from 'supertest';
import { createIntegrationRoutes } from '../src/api/routes/integration.routes';

describe('integration routes', () => {
  it('accepts and routes a valid event', async () => {
    const route = jest.fn().mockResolvedValue(undefined);
    const app = express();
    app.use(express.json());
    app.use('/api/integration', createIntegrationRoutes({ route } as any));

    const response = await request(app).post('/api/integration/events').send({
      type: 'SALE_ADD',
      payload: { amount: 450, mode: 'CASH' },
    });

    expect(response.status).toBe(202);
    expect(route).toHaveBeenCalledTimes(1);
  });
});
