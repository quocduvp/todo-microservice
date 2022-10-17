const ServiceWorker = require("./broker/nats");
const fastify = require("./server");

(async () => {
  const broker = new ServiceWorker({
    servers: process.env["NATS_URL"] || "nats://localhost:4222",
    token: process.env["NATS_TOKEN"] || '^*&*(!ƯHUKWH)'
  });
  await broker.start();

  // export global emitter
  global.brokerCall = broker.emit();

  fastify.listen({ port: process.env['PORT'] || 3001, host: "0.0.0.0" }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`server listening on ${address}`);
  });
})();
