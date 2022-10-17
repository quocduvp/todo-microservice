const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("./routes/v1/auth"), { prefix: "/v1" });
fastify.register(require("./routes/v1/todo"), { prefix: "/v1" });

// Error hook
fastify.setErrorHandler(function (error, request, reply) {
  // Send error response
  reply.status(400).send({ ok: false, message: error.message });
});

module.exports = fastify;
