const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const LikesRepository = require('../../Domains/likes/LikesRepository');
const PuttedLike = require('../../Domains/likes/entities/PuttedLike');

class LikeRepositoryPostgres extends LikesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike({ threadId, commentId, credentialId }) {
    const id = `like-${this._idGenerator()}`;
    
    const query = {
      text: `INSERT INTO likes VALUES($1, $2, $3, $4)`,
      values: [id, credentialId, threadId, commentId],
    };

    await this._pool.query(query);
    return new PuttedLike('success');
  }

  async deleteLike({ threadId, commentId, credentialId }) {
    const query = {
      text: `DELETE FROM likes WHERE thread_id=$1 AND comment_id=$2 AND owner=$3`,
      values: [threadId, commentId, credentialId],
    };
    await this._pool.query(query);
    return new PuttedLike('success');
  }

  async verifyLikeOwner({ threadId, commentId, credentialId }) {
    const query = {
      text: `SELECT * FROM likes WHERE thread_id=$1 AND comment_id=$2 AND owner=$3`,
      values: [threadId, commentId, credentialId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;
