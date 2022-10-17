const { createValidateFunction } = require("../config/validation");

function validation(schema, type) {
  return async (req, rep) => {
    await createValidateFunction(schema)(req[type]);
  };
}

module.exports = {
  validation,
};
