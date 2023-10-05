const PutLike = require('../../../Domains/likes/entities/PutLike');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikesRepository');
const PutLikeUseCase = require('../PutLikeUseCase');

// Arrange
const threadId = 'thread-123'
const commentId = 'comment-123'
const credentialId = 'user-123'

const responseGetThreadById = {
  id: threadId, 
  title: 'title', 
  body: 'body', 
  date: 'date', 
  username: credentialId
}
const responseGetCommentById = {
  id: commentId,
  content: 'dicoding',
  threadId: threadId,
  owner: credentialId,
};

const expectedPuttedLike = new PutLike({
  threadId: threadId,
  commentId: commentId,
  credentialId: credentialId,
});

/** creating dependency of use case */
const mockThreadRepository = new ThreadRepository();
const mockCommentRepository = new CommentRepository();
const mockLikeRepository = new LikeRepository();

describe('PutLikeUseCase', () => {
  it('should orchestrating the put like action correctly add like comment', async () => {

    // Setup mock repository behavior
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(responseGetThreadById));
    mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve(responseGetCommentById));
    mockLikeRepository.verifyLikeOwner = jest.fn(() => Promise.resolve([]));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve({status: 'success'}));

    const putLikeUseCase = new PutLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    const result = await putLikeUseCase.execute(threadId, commentId, credentialId);

    expect(result).toStrictEqual({ status: 'success' });

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledTimes(1);
    expect(mockLikeRepository.verifyLikeOwner).toHaveBeenCalledTimes(1);
    expect(mockLikeRepository.addLike).toHaveBeenCalledTimes(1);

    // Check the arguments passed to the mocks
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(commentId);
    expect(mockLikeRepository.verifyLikeOwner).toHaveBeenCalledWith(expect.objectContaining({
      threadId: threadId,
      commentId: commentId,
      credentialId: credentialId,
    }));
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(expectedPuttedLike);
  });

  it('should orchestrating the put like action correctly delete like comment', async () => {
    // Setup mock repository behavior
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(responseGetThreadById));
    mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve(responseGetCommentById));
    mockLikeRepository.verifyLikeOwner = jest.fn(() => Promise.resolve([expectedPuttedLike]));
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve({status: 'success'}));

    const putLikeUseCase = new PutLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    const result = await putLikeUseCase.execute(threadId, commentId, credentialId);

    expect(result).toStrictEqual({ status: 'success' });

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledTimes(1);
    expect(mockLikeRepository.verifyLikeOwner).toHaveBeenCalledTimes(1);
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledTimes(1);

    // Check the arguments passed to the mocks
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(commentId);
    expect(mockLikeRepository.verifyLikeOwner).toHaveBeenCalledWith(expect.objectContaining({
      threadId: threadId,
      commentId: commentId,
      credentialId: credentialId,
    }));
    
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(expectedPuttedLike);    
  });
});