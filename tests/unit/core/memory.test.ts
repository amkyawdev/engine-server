// Memory Tests
import { sessionManager } from '../../src/core/memory/session.js';
import { MemoryCache } from '../../src/core/memory/cache.js';

describe('SessionManager', () => {
  beforeEach(() => {
    sessionManager.clear();
  });

  describe('create', () => {
    it('should create a new session', () => {
      const session = sessionManager.create('user-1', 'agent-1');

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.userId).toBe('user-1');
      expect(session.agentId).toBe('agent-1');
    });
  });

  describe('get', () => {
    it('should retrieve a session by id', () => {
      const created = sessionManager.create('user-1');
      const retrieved = sessionManager.get(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(created.id);
    });

    it('should return undefined for non-existent session', () => {
      const retrieved = sessionManager.get('non-existent');

      expect(retrieved).toBeUndefined();
    });
  });

  describe('addConversationItem', () => {
    it('should add a conversation item to session', () => {
      const session = sessionManager.create('user-1');

      const added = sessionManager.addConversationItem(session.id, {
        role: 'user',
        content: 'Hello',
      });

      expect(added).toBe(true);

      const updated = sessionManager.get(session.id);
      expect(updated!.context.history).toHaveLength(1);
      expect(updated!.context.history[0].content).toBe('Hello');
    });
  });
});

describe('MemoryCache', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache({ ttl: 1 });
  });

  describe('set and get', () => {
    it('should store and retrieve values', () => {
      cache.set('key1', 'value1');
      const value = cache.get('key1');

      expect(value).toBe('value1');
    });

    it('should return undefined for expired keys', async () => {
      cache.set('key1', 'value1');
      
      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const value = cache.get('key1');
      expect(value).toBeUndefined();
    });
  });

  describe('stats', () => {
    it('should track hits and misses', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('key2'); // miss

      const stats = cache.stats();

      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(0.5);
    });
  });
});
