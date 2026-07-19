// Job Scheduler
import { createLogger } from '../shared/utils/logger.js';
const logger = createLogger('workers:scheduler');
export class JobScheduler {
    schedules = new Map();
    timers = new Map();
    add(id, name, cron, handler) {
        const schedule = {
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
    remove(id) {
        const timer = this.timers.get(id);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(id);
        }
        this.schedules.delete(id);
        logger.info({ scheduleId: id }, 'Schedule removed');
    }
    enable(id) {
        const schedule = this.schedules.get(id);
        if (!schedule)
            return false;
        schedule.enabled = true;
        this.scheduleNext(id);
        logger.info({ scheduleId: id }, 'Schedule enabled');
        return true;
    }
    disable(id) {
        const schedule = this.schedules.get(id);
        if (!schedule)
            return false;
        schedule.enabled = false;
        const timer = this.timers.get(id);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(id);
        }
        logger.info({ scheduleId: id }, 'Schedule disabled');
        return true;
    }
    list() {
        return [...this.schedules.values()];
    }
    scheduleNext(id) {
        const schedule = this.schedules.get(id);
        if (!schedule || !schedule.enabled)
            return;
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
    async execute(id) {
        const schedule = this.schedules.get(id);
        if (!schedule || !schedule.enabled)
            return;
        schedule.lastRun = new Date();
        logger.debug({ scheduleId: id }, 'Running scheduled job');
        try {
            await schedule.handler();
        }
        catch (error) {
            logger.error({ scheduleId: id, error }, 'Scheduled job failed');
        }
    }
}
export const jobScheduler = new JobScheduler();
//# sourceMappingURL=scheduler.js.map