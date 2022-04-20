const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return thread correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        content: 'dicoding',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        content: 'dicoding',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123'
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'dicoding',
        owner: 'user-123'
      }));
    });
  });

  describe('deleteReplyById function', () => {
    it('should persist delete reply and return thread correctly', async () => {
      // Arrange
      const replyId = 'reply-123'
      await RepliesTableTestHelper.addReply({ id: replyId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply[0].is_delete).toEqual(true);
    });
  });

  describe('getReplyById function', () => {
    it('should throw NotFoundError when id not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(replyRepositoryPostgres.getReplyById('reply-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return all fields reply when id is found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'dicoding',
        date: '2022-04-19 04:18:51.806',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123'
      });

      // Action & Assert
      const thread = await replyRepositoryPostgres.getReplyById('reply-123');
      expect(thread.content).toBe('dicoding');
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when reply not authorize', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should return all fields reply when reply is authorize', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'dicoding',
        date: '2022-04-19 04:18:51.806',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123'
      });

      // Action & Assert
      const thread = await replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123');
      expect(thread.content).toBe('dicoding');
    });
  });

});