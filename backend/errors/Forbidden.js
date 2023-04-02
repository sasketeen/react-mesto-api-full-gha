class Forbidden extends Error {
  constructor() {
    super('Доступ запрещен');
    this.name = 'Forbidden';
    this.statusCode = 403;
  }
}

module.exports = Forbidden;
