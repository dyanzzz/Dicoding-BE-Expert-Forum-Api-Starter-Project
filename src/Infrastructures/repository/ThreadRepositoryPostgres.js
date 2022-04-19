const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payloadThread) {
    const { title, body, owner } = payloadThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('ThreadId tidak ditemukan');
    }

    return result.rows[0];
  }
  
  async getDetailThreadById(id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, threads.owner, users.username
          FROM threads
          LEFT JOIN users ON users.id = threads.owner
          WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('ThreadId tidak ditemukan');
    }

    const queryComment = {
      text: `SELECT commen.id, commen.content, commen.date, users.username, commen.is_delete
          FROM comments as commen
          LEFT JOIN users ON commen.owner = users.id
          WHERE commen.thread_id = $1`,
      values: [id],
    };

    const resultComment = await this._pool.query(queryComment);

    result.rows[0].comments = resultComment.rows

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
