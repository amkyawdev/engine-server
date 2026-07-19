// Job Queue
import { createLogger } from '../shared/utils/logger.js';

const logger = createLogger('workers:queue');

export interface Job<T = unknown> {
  id: string;
  type: string;
  data: T;
  priority?: number;
  attempts: number;
  maxAttempts?: number;
  createdAt: Date;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export class JobQueue<T = unknown> {
  private queue: Job<T>[] = [];
  private processing: Set<string> = new Set();

  enqueue(job: Omit<Job<T>, 'id' | 'attempts' | 'createdAt'>): string {
    const id = `job-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newJob: Job<T> = {
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

  dequeue(): Job<T> | undefined {
    const job = this.queue.shift();
    if (job) {
      this.processing.add(job.id);
      job.startedAt = new Date();
      logger.debug({ jobId: job.id }, 'Job dequeued');
    }
    return job;
  }

  complete(jobId: string): void {
    this.processing.delete(jobId);
    logger.info({ jobId }, 'Job completed');
  }

  fail(jobId: string, error: string): void {
    const job = this.queue.find((j) => j.id === jobId);
    if (job) {
      job.attempts++;
      job.error = error;
    }
    this.processing.delete(jobId);
    logger.warn({ jobId, error, attempts: job?.attempts }, 'Job failed');
  }

  size(): number {
    return this.queue.length;
  }

  getProcessingCount(): number {
    return this.processing.size;
  }

  clear(): void {
    this.queue = [];
    this.processing.clear();
  }
}

export const jobQueue = new JobQueue();
