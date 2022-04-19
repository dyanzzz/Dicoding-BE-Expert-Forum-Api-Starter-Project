const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentsRepository = require('../../Domains/comments/CommentsRepository');

class CommentRepositoryPostgres extends CommentsRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(payloadThread) {
    const { content, threadId, owner } = payloadThread;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: `INSERT INTO "comments" VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner`,
      values: [id, content, date, threadId, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const query = {
      text: `UPDATE "comments" SET is_delete=true WHERE id=$1`,
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getCommentById(commentId) {
    const query = {
      text: `SELECT * FROM comments WHERE id=$1`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment id tidak ditemukan')
    }

    return result.rows[0];
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: `SELECT * FROM comments WHERE id=$1 AND owner=$2`,
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak memiliki akses untuk comment ini')
    }

    return result.rows[0];
  }
}

module.exports = CommentRepositoryPostgres;
