const AddedComment = require('../../Domains/comments/entities/AddedComment');
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
      text: `DELETE FROM "comments" WHERE id=$1`,
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
