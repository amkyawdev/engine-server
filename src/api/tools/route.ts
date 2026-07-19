// Tools Route
import { FastifyInstance } from 'fastify';
import { toolRegistry } from '../../core/tools/registry.js';

export async function toolsRoute(app: FastifyInstance) {
  // List all tools
  app.get('/', async (request, reply) => {
    const tools = toolRegistry.list();
    return reply.send({ tools, total: tools.length });
  });

  // Get tool by ID
  app.get<{ Params: { id: string } }>(
    '/:id',
    async (request, reply) => {
      const { id } = request.params;
      const tool = toolRegistry.get(id);

      if (!tool) {
        return reply.status(404).send({
          error: {
            code: 'TOOL_NOT_FOUND',
            message: `Tool '${id}' not found`,
          },
        });
      }

      return reply.send(tool);
    }
  );

  // List tools by category
  app.get<{ Params: { category: string } }>(
    '/category/:category',
    async (request, reply) => {
      const category = (request.params as { category: string }).category;
      const tools = toolRegistry.listByCategory(category);
      return reply.send({ tools, total: tools.length });
    }
  );
}
