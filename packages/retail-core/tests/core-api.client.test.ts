import axios from 'axios';
import { CoreApiClient } from '../src/core/integration/core-api.client';

jest.mock('axios');

describe('CoreApiClient', () => {
  it('publishes an event through the configured API', async () => {
    const post = jest.fn().mockResolvedValue({ data: { ok: true } });
    const get = jest.fn().mockResolvedValue({ data: { ok: true } });
    (axios.create as jest.Mock).mockReturnValue({ post, get });

    const client = new CoreApiClient({ baseUrl: 'https://core-api.example' });
    await client.publishEvent({ type: 'SALE_ADD', source: 'APP', payload: { amount: 450, mode: 'CASH' } });

    expect(post).toHaveBeenCalledWith('/api/events', expect.objectContaining({ type: 'SALE_ADD' }));
  });
});
