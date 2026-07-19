// Job Scheduler
import { createLogger } from '../shared/utils/logger.js';
import { jobQueue } from './queue.js';

const logger = createLogger('workers:scheduler');

export interface Schedule {
  id: string;
  name: string;
  cron: string;
  handler: () => Promise<void>;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export class JobScheduler {
  private schedules: Map<string, Schedule> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  add(id: string, name: string, cron: string, handler: () => Promise<void>): void {
    const schedule: Schedule = {
      id,
      name,
      cron,
      handler,
      enabled: true,
    };

    this.schedules.set(id, schedule);
    this.scheduleNext(id);

    logger.info({ scheduleId: id, name, cron }, 'Schedule added');
  }

  remove(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.schedules.delete(id);
    logger.info({ scheduleId: id }, 'Schedule removed');
  }

  enable(id: string): boolean {
    const schedule = this.schedules.get(id);
    if (!schedule) return false;

    schedule.enabled = true;
    this.scheduleNext(id);
    logger.info({ scheduleId: id }, 'Schedule enabled');
    return true;
  }

  disable(id: string): boolean {
    const schedule = this.schedules.get(id);
    if (!schedule) return false;

    schedule.enabled = false;
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    logger.info({ scheduleId: id }, 'Schedule disabled');
    return true;
  }

  list(): Schedule[] {
    return [...this.schedules.values()];
  }

  private scheduleNext(id: string): void {
    const schedule = this.schedules.get(id);
    if (!schedule || !schedule.enabled) return;

    // Calculate next run time (simplified - use node-cron in production)
    const nextRun = new Date(Date.now() + 60000); // Placeholder
    schedule.nextRun = nextRun;

    const delay = nextRun.getTime() - Date.now();
    const timer = setTimeout(async () => {
      await this.execute(id);
      this.scheduleNext(id);
    }, delay);

    this.timers.set(id, timer);
  }

  private async execute(id: string): Promise<void> {
    const schedule = this.schedules.get(id);
    if (!schedule || !schedule.enabled) return;

    schedule.lastRun = new Date();
    logger.debug({ scheduleId: id }, 'Running scheduled job');

    try {
      await schedule.handler();
    } catch (error) {
      logger.error({ scheduleId: id, error }, 'Scheduled job failed');
    }
  }
}

export const jobScheduler = new JobScheduler();
