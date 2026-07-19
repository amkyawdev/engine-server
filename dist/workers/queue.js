// Job Queue
import { createLogger } from '../shared/utils/logger.js';
const logger = createLogger('workers:queue');
export class JobQueue {
    queue = [];
    processing = new Set();
    enqueue(job) {
        const id = `job-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const newJob = {
            ...job,
            id,
            attempts: 0,
            createdAt: new Date(),
        };
        this.queue.push(newJob);
        this.queue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        logger.info({ jobId: id, type: job.type }, 'Job enqueued');
        return id;
    }
    dequeue() {
        const job = this.queue.shift();
        if (job) {
            this.processing.add(job.id);
            job.startedAt = new Date();
            logger.debug({ jobId: job.id }, 'Job dequeued');
        }
        return job;
    }
    complete(jobId) {
        this.processing.delete(jobId);
        logger.info({ jobId }, 'Job completed');
    }
    fail(jobId, error) {
        const job = this.queue.find((j) => j.id === jobId);
        if (job) {
            job.attempts++;
            job.error = error;
        }
        this.processing.delete(jobId);
        logger.warn({ jobId, error, attempts: job?.attempts }, 'Job failed');
    }
    size() {
        return this.queue.length;
    }
    getProcessingCount() {
        return this.processing.size;
    }
    clear() {
        this.queue = [];
        this.processing.clear();
    }
}
export const jobQueue = new JobQueue();
//# sourceMappingURL=queue.js.map