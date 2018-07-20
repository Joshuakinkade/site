import knex from 'knex';

let _db = null;

const db = {
  init() {
    _db = knex({
      client: 'mysql',
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
      },
      pool: {
        min: 0,
        max: 10
      }
    });
  },
  getConnection() {
    if (_db) {
      return _db;
    } else {
      throw new Error('Database driver not initialized');
    }
  }
}

export default db;