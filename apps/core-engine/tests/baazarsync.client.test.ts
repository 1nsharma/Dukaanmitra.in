import axios from 'axios';
import { BaazarSyncClient } from '../src/core/integration/baazarsync.client';

jest.mock('axios');

describe('BaazarSyncClient', () => {
  it('publishes an event through the configured API', async () => {
    const post = jest.fn().mockResolvedValue({ data: { ok: true } });
    const get = jest.fn().mockResolvedValue({ data: { ok: true } });
    (axios.create as jest.Mock).mockReturnValue({ post, get });

    const client = new BaazarSyncClient({ baseUrl: 'https://baazarsync.example' });
    await client.publishEvent({ type: 'SALE_ADD', source: 'APP', payload: { amount: 450, mode: 'CASH' } });

    expect(post).toHaveBeenCalledWith('/api/events', expect.objectContaining({ type: 'SALE_ADD' }));
  });
});
