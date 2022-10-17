const { authorization } = require("../../../hooks/authorization");
const { validation } = require("../../../hooks/validation");
const { login, profile, register } = require("./auth-controller");
const { loginSchema } = require("./auth-schema");

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").RouteShorthandOptions} opts
 * @param {*} done
 */
module.exports = (fastify, opts, done) => {

  fastify.post(
    "/auth/login",
    {
      preValidation: validation(loginSchema, "body"),
    },
    login
  );

  fastify.post(
    "/auth/register",
    {
      preValidation: validation(loginSchema, "body"),
    },
    register,
  );

  fastify.get(
    "/auth/me",
    {
      onRequest: [authorization],
    },
    profile
  );

  done();
};
