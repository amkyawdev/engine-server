// Job Processor
import { createLogger } from '../shared/utils/logger.js';
import { jobQueue } from './queue.js';
const logger = createLogger('workers:processor');
export class JobProcessor {
    handlers = new Map();
    running = false;
    processor;
    concurrency;
    pollInterval;
    constructor(options = {}) {
        this.concurrency = options.concurrency ?? 5;
        this.pollInterval = options.pollInterval ?? 1000;
    }
    register(type, handler) {
        this.handlers.set(type, handler);
        logger.info({ type }, 'Job handler registered');
    }
    start() {
        if (this.running)
            return;
        this.running = true;
        logger.info('Job processor started');
        this.processor = setInterval(() => this.processJobs(), this.pollInterval);
    }
    stop() {
        this.running = false;
        if (this.processor) {
            clearInterval(this.processor);
            this.processor = undefined;
        }
        logger.info('Job processor stopped');
    }
    async processJobs() {
        const activeCount = jobQueue.getProcessingCount();
        const availableSlots = this.concurrency - activeCount;
        if (availableSlots <= 0)
            return;
        for (let i = 0; i < availableSlots; i++) {
            const job = jobQueue.dequeue();
            if (!job)
                break;
            const handler = this.handlers.get(job.type);
            if (!handler) {
                jobQueue.fail(job.id, `No handler for job type: ${job.type}`);
                continue;
            }
            this.executeJob(job, handler);
        }
    }
    async executeJob(job, handler) {
        try {
            await handler(job);
            jobQueue.complete(job.id);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            jobQueue.fail(job.id, message);
        }
    }
}
export const jobProcessor = new JobProcessor();
//# sourceMappingURL=processor.js.map