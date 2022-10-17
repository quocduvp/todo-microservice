const Todo = require("../../models/todo");

/**
 *
 * @param {*} filter
 * @param {{ skip, limit, select }} opts
 */
async function list(filter, opts = {}) {
  try {
    const todos = await Todo.find(filter, opts.select, {
      skip: opts.skip,
      limit: opts.limit,
      sort: { createdAt: -1 }
    });
    return todos;
  } catch (error) {
    throw error;
  }
}

async function get(filter) {
  try {
    const todo = await Todo.findOne(filter);
    return todo;
  } catch (error) {
    throw error;
  }
}

async function create(payload) {
  try {
    const todo = new Todo();
    for (let key in payload) {
      todo[key] = payload[key];
    }
    await todo.save();
    return todo;
  } catch (error) {
    throw error;
  }
}

async function update(filter, payload) {
  try {
    await Todo.updateOne(filter, payload);
  } catch (error) {
    throw error;
  }
}

async function remove(filter) {
  try {
    await Todo.deleteOne(filter);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
