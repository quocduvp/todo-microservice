const todoMethods = require("./methods");

const list = {
  name: "list",
  version: 1,
  validate: {
    actorId: "string|convert",
    keywords: "string|convert|optional",
    limit: "number|optional|default:20",
    skip: "number|optional|default:0",
  },
  async handle(ctx) {
    const { actorId, keywords, skip, limit } = ctx["payload"];
    const specs = {};
    if (keywords) {
      specs.$or = [
        {
          title: new RegExp(keywords, "gi"),
        },
        {
          title: new RegExp(keywords, "gi"),
        },
      ];
    }
    const result = await todoMethods.list(
      {
        ...specs,
        createdBy: actorId,
      },
      {
        skip,
        limit,
      }
    );
    return result;
  },
};

const get = {
  name: "get",
  version: 1,
  validate: {
    actorId: "string|convert",
    todoId: "string|convert",
  },
  async handle(ctx) {
    const { actorId, todoId } = ctx["payload"];
    const result = await todoMethods.get({
      _id: todoId,
      createdBy: actorId,
    });
    return result;
  },
};

const create = {
  name: "create",
  version: 1,
  validate: {
    actorId: "string|convert",
    title: "string|convert",
    description: "string|convert|optional",
  },
  async handle(ctx) {
    const { actorId, title, description } = ctx["payload"];
    const result = await todoMethods.create({
      title,
      description,
      createdBy: actorId,
    });
    return result;
  },
};

const update = {
  name: "update",
  version: 1,
  validate: {
    actorId: "string|convert",
    todoId: "string|convert",
    title: "string|convert|optional",
    description: "string|convert|optional",
  },
  async handle(ctx) {
    const { actorId, todoId, title, description } = ctx["payload"];

    const input = {};
    if (title) input["title"] = title;

    if (description) input["description"] = description;

    if (Object.keys(input) < 1) {
      throw new Error("Update error");
    }

    await todoMethods.update(
      {
        _id: todoId,
        createdBy: actorId,
      },
      input
    );
    return {};
  },
};

const remove = {
  name: "remove",
  version: 1,
  validate: {
    actorId: "string|convert",
    todoId: "string|convert",
  },
  async handle(ctx) {
    const { actorId, todoId } = ctx["payload"];

    await todoMethods.remove({
      _id: todoId,
      createdBy: actorId,
    });
    return {};
  },
};

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
