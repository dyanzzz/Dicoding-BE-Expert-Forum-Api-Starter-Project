const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetedThread = require('../../../Domains/threads/entities/GetedThread');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123'
    
    const payload = {
      id: threadId,
      title: 'dicoding',
      body: 'Dicoding-Indonesia',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const comments = [
      {
        id: "comment-123",
        username: "dicoding",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        is_delete: false,
      },
      {
        id: "comment-124",
        username: "dicoding",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        is_delete: true,
      },
    ];
    comments.forEach((row, i) => {
      const content = (row.is_delete) ? "**komentar telah dihapus**" : row.content
      comments[i].content = content
    });
    
    payload.comments = comments

    const expectedGetedThread = new GetedThread(payload);

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn().mockImplementation(() => Promise.resolve(expectedGetedThread));

    /** creating use case instance */
    const getThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const gettedThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(gettedThread).toStrictEqual(expectedGetedThread);
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(threadId);
  });

});