import axios, { AxiosInstance } from 'axios';

export interface BaazarSyncConfig {
  baseUrl: string;
  apiKey?: string;
  bearerToken?: string;
  timeoutMs?: number;
}

export interface BaazarSyncEvent {
  id?: string;
  type: string;
  source: string;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export class BaazarSyncClient {
  private readonly http: AxiosInstance;

  constructor(config: BaazarSyncConfig) {
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs ?? 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey ? { 'X-API-Key': config.apiKey } : {}),
        ...(config.bearerToken ? { Authorization: `Bearer ${config.bearerToken}` } : {}),
      },
    });
  }

  async health(): Promise<unknown> {
    const response = await this.http.get('/health');
    return response.data;
  }

  async publishEvent(event: BaazarSyncEvent): Promise<unknown> {
    const response = await this.http.post('/api/events', event);
    return response.data;
  }

  async syncSale(sale: { id: string; customerId?: string | null; amount: number; mode: string; source: string; confidence?: number | null; eventId?: string | null; createdAt: string }): Promise<unknown> {
    const response = await this.http.post('/api/sales/sync', sale);
    return response.data;
  }

  async syncCustomer(customer: { id: string; phone: string; name?: string | null; totalSales: number; totalOrders: number; lastOrderAt?: string | null; preferredMode?: string | null; averageOrderValue: number }): Promise<unknown> {
    const response = await this.http.post('/api/customers/sync', customer);
    return response.data;
  }
}
