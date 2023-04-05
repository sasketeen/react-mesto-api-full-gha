const { NODE_ENV, JWT_SECRET = 'secret-key' } = process.env;

module.exports = {
  NODE_ENV,
  JWT_SECRET,
};
