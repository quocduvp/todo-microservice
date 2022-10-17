async function authorization(req, rep) {
  try {
    const [, token] = req.headers['authorization'].split(" ");
    const { ok, result, message } = await global.brokerCall("v1.user.verify_token", { token });
    if (!ok) {
      throw new Error(message);
    }
    req.user = result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
    authorization,
}