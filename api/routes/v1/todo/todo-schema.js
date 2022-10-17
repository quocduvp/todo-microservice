const listSchema = {
  keywords: "string|convert|optional",
  limit: "number|optional|default:20|convert",
  skip: "number|optional|default:0|convert",
};

const createSchema = {
  title: "string|convert",
  description: "string|convert|optional",
};

module.exports = {
  listSchema,
  createSchema,
};
