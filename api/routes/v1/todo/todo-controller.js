/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} rep
 */
async function list(req, rep) {
  try {
    const user = req.user;
    const todos = await global.brokerCall("v1.todo.list", {
      ...req.query,
      actorId: user.id,
    });
    rep.send(todos);
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} rep
 */
 async function create(req, rep) {
  try {
    const user = req.user;
    const todo = await global.brokerCall("v1.todo.create", {
      ...req.body,
      actorId: user.id,
    });
    rep.send(todo);
  } catch (error) {
    throw error
  }
}

module.exports = { list, create }