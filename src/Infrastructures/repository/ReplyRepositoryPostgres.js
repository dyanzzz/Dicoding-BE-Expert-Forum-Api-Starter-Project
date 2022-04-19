const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(payloadThread) {
    const { content, owner, threadId, commentId } = payloadThread;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReplyById(id) {
    const query = {
      text: `UPDATE replies SET is_delete=true WHERE id=$1`,
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
