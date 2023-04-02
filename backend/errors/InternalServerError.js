class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
    this.message = 'На сервере произошла ошибка';
  }
}

module.exports = InternalServerError;
