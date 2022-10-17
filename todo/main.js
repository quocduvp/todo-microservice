const connect = require("./config/connector");
const ServiceWorker = require("./broker/nats");

const todoAction = require("./services/todo/actions");

(async () => {
  try {
    await connect();
    const broker = new ServiceWorker({
      servers: process.env["NATS_URL"] || "nats://localhost:4222",
      token: process.env["NATS_TOKEN"],
    });
    await broker.start();

    const todoActions = [];
    todoActions.push(todoAction.list);
    todoActions.push(todoAction.get);
    todoActions.push(todoAction.create);
    todoActions.push(todoAction.update);
    todoActions.push(todoAction.remove);
    await broker.createService("todo", 1, todoActions);
  } catch (error) {
    console.log(error);
  }
})();
