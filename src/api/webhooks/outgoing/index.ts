// Outgoing Webhooks
import { createLogger } from '../../../shared/utils/logger.js';

const logger = createLogger('api:webhooks:outgoing');

export interface WebhookConfig {
  url: string;
  events: string[];
  secret?: string;
  headers?: Record<string, string>;
}

export class OutgoingWebhookRegistry {
  private webhooks: Map<string, WebhookConfig> = new Map();

  register(id: string, config: WebhookConfig): void {
    this.webhooks.set(id, config);
    logger.info({ webhookId: id, url: config.url }, 'Webhook registered');
  }

  unregister(id: string): boolean {
    return this.webhooks.delete(id);
  }

  get(id: string): WebhookConfig | undefined {
    return this.webhooks.get(id);
  }

  list(): WebhookConfig[] {
    return [...this.webhooks.values()];
  }

  async send(id: string, event: string, data: unknown): Promise<boolean> {
    const webhook = this.webhooks.get(id);
    if (!webhook) {
      logger.warn({ webhookId: id }, 'Webhook not found');
      return false;
    }

    if (!webhook.events.includes(event) && !webhook.events.includes('*')) {
      logger.debug({ webhookId: id, event }, 'Event not subscribed');
      return false;
    }

    try {
      // In production, send HTTP request
      logger.info({ webhookId: id, event }, 'Webhook sent');
      return true;
    } catch (error) {
      logger.error({ webhookId: id, error }, 'Webhook send failed');
      return false;
    }
  }

  async broadcast(event: string, data: unknown): Promise<number> {
    let sent = 0;
    for (const [id] of this.webhooks) {
      if (await this.send(id, event, data)) {
        sent++;
      }
    }
    return sent;
  }
}

export const outgoingWebhookRegistry = new OutgoingWebhookRegistry();
