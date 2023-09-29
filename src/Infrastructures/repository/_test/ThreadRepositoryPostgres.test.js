const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'dicoding',
        body: 'ini testing body',
        date: '2022-04-19 04:18:51.806',
        owner: 'user-123'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'dicoding',
        body: 'ini testing body',
        date: '2022-04-19 04:18:51.806',
        owner: 'user-123'
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'dicoding',
        owner: 'user-123'
      }));
    });
  });

  describe('getThreadById', () => {
    it('should throw InvariantError when id not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return all fields threads when id is found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'dicoding',
        body: 'ini body thread',
        date: '2022-04-19 04:18:51.806',
        owner: 'user-123'
      });

      // Action & Assert
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');
      expect(thread.title).toBe('dicoding');
    });
  });

  describe('getDetailThreadById', () => {
    it('should throw InvariantError when id not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
    
    it('should return all fields threads when id is found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'dicoding',
        body: 'ini body thread',
        date: '2022-04-19 04:18:51.806',
        owner: 'user-123'
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123', 
        content: 'dicoding', 
        date: '2021-08-08T07:26:21.338Z',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      // Action & Assert
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');
      expect(thread.title).toBe('dicoding');
      expect(thread).toHaveProperty('id', 'thread-123');
      expect(thread).toHaveProperty('title', 'dicoding');
      expect(thread).toHaveProperty('body', 'ini body thread');
      expect(thread).toHaveProperty('username', 'dicoding');
      expect(thread).toHaveProperty('date');
    });
  });
});
