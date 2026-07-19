import { skillRegistry } from '../../core/skills/registry.js';
export async function skillsRoute(app) {
    // List all skills
    app.get('/', async (request, reply) => {
        const skills = skillRegistry.list();
        return reply.send({ skills, total: skills.length });
    });
    // Get skill by ID
    app.get('/:id', async (request, reply) => {
        const { id } = request.params;
        const skill = skillRegistry.get(id);
        if (!skill) {
            return reply.status(404).send({
                error: {
                    code: 'SKILL_NOT_FOUND',
                    message: `Skill '${id}' not found`,
                },
            });
        }
        return reply.send(skill);
    });
    // Search skills
    app.get('/search', async (request, reply) => {
        const { q } = request.query;
        if (!q) {
            return reply.status(400).send({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Query parameter "q" is required',
                },
            });
        }
        const skills = skillRegistry.search(q);
        return reply.send({ skills, total: skills.length });
    });
}
//# sourceMappingURL=route.js.map