// Job Processor
import { createLogger } from '../shared/utils/logger.js';
import { jobQueue, type Job } from './queue.js';

const logger = createLogger('workers:processor');

export interface ProcessorOptions {
  concurrency?: number;
  pollInterval?: number;
}

export type JobHandler<T = unknown> = (job: Job<T>) => Promise<void>;

export class JobProcessor {
  private handlers: Map<string, JobHandler> = new Map();
  private running = false;
  private processor?: NodeJS.Timeout;
  private concurrency: number;
  private pollInterval: number;

  constructor(options: ProcessorOptions = {}) {
    this.concurrency = options.concurrency ?? 5;
    this.pollInterval = options.pollInterval ?? 1000;
  }

  register(type: string, handler: JobHandler): void {
    this.handlers.set(type, handler);
    logger.info({ type }, 'Job handler registered');
  }

  start(): void {
    if (this.running) return;

    this.running = true;
    logger.info('Job processor started');

    this.processor = setInterval(() => this.processJobs(), this.pollInterval);
  }

  stop(): void {
    this.running = false;
    if (this.processor) {
      clearInterval(this.processor);
      this.processor = undefined;
    }
    logger.info('Job processor stopped');
  }

  private async processJobs(): Promise<void> {
    const activeCount = jobQueue.getProcessingCount();
    const availableSlots = this.concurrency - activeCount;

    if (availableSlots <= 0) return;

    for (let i = 0; i < availableSlots; i++) {
      const job = jobQueue.dequeue();
      if (!job) break;

      const handler = this.handlers.get(job.type);
      if (!handler) {
        jobQueue.fail(job.id, `No handler for job type: ${job.type}`);
        continue;
      }

      this.executeJob(job, handler);
    }
  }

  private async executeJob<T>(job: Job<T>, handler: JobHandler<T>): Promise<void> {
    try {
      await handler(job);
      jobQueue.complete(job.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      jobQueue.fail(job.id, message);
    }
  }
}

export const jobProcessor = new JobProcessor();
