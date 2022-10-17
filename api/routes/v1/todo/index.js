const { authorization } = require("../../../hooks/authorization");
const { validation } = require("../../../hooks/validation");
const { list, create, update, remove } = require("./todo-controller");
const { listSchema, createSchema } = require("./todo-schema");

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").RouteShorthandOptions} opts
 * @param {*} done
 */
module.exports = (fastify, opts, done) => {
  fastify.get(
    "/todo",
    {
      preValidation: validation(listSchema, "query"),
      onRequest: [authorization],
    },
    list
  );

  fastify.post(
    "/todo",
    {
      preValidation: validation(createSchema, "body"),
      onRequest: [authorization],
    },
    create
  );

  // fastify.put(
  //   "/todo/:id",
  //   {
  //     preValidation: validation(createSchema, "body"),
  //     onRequest: [authorization],
  //   },
  //   update
  // );

  // fastify.delete(
  //   "/todo/:id",
  //   {
  //     onRequest: [authorization],
  //   },
  //   remove
  // );

  done();
};
