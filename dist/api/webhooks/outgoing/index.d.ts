export interface WebhookConfig {
    url: string;
    events: string[];
    secret?: string;
    headers?: Record<string, string>;
}
export declare class OutgoingWebhookRegistry {
    private webhooks;
    register(id: string, config: WebhookConfig): void;
    unregister(id: string): boolean;
    get(id: string): WebhookConfig | undefined;
    list(): WebhookConfig[];
    send(id: string, event: string, data: unknown): Promise<boolean>;
    broadcast(event: string, data: unknown): Promise<number>;
}
export declare const outgoingWebhookRegistry: OutgoingWebhookRegistry;
//# sourceMappingURL=index.d.ts.map