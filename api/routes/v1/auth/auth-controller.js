/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} rep
 */
async function login(req, rep) {
  try {
    const payload = req.body;
    const user = await global.brokerCall("v1.user.login", payload);
    rep.send(user);
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} rep
 */
 async function register(req, rep) {
  try {
    const payload = req.body;
    const user = await global.brokerCall("v1.user.register", payload);
    console.log(user)
    rep.send(user);
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} rep
 * @param {*} next
 */
async function profile(req, rep) {
  try {
    rep.send(req.user);
  } catch (error) {
    throw error
  }
}


module.exports = { login, profile, register }