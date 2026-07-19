export interface Schedule {
    id: string;
    name: string;
    cron: string;
    handler: () => Promise<void>;
    enabled: boolean;
    lastRun?: Date;
    nextRun?: Date;
}
export declare class JobScheduler {
    private schedules;
    private timers;
    add(id: string, name: string, cron: string, handler: () => Promise<void>): void;
    remove(id: string): void;
    enable(id: string): boolean;
    disable(id: string): boolean;
    list(): Schedule[];
    private scheduleNext;
    private execute;
}
export declare const jobScheduler: JobScheduler;
//# sourceMappingURL=scheduler.d.ts.map