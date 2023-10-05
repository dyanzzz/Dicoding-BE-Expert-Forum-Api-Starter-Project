const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentsRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const DetailThreadUseCase = require('../DetailThreadUseCase')
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail')
const ReplyDetail = require('../../../Domains/replies/entities/ReplyDetail')

describe('DetailThreadUseCase', () => {
	it('should orchestrating the add thread action correctly', async () => {
		// Arrange
		const threadId = 'thread-123'

		const expectedThreadDetails = {
			id: threadId,
			title: 'dicoding',
			body: 'Dicoding-Indonesia',
			date: '2021-08-08T07:19:09.775Z',
			username: 'dicoding',
			comments: [
				new CommentDetail({
					id: 'comment-123',
					username: 'dicoding',
					date: '2021-08-08T07:22:33.555Z',
					content: 'sebuah comment',
					is_delete: false,
					like_count: 0,
					replies: [
						new ReplyDetail({
							id: 'reply-123',
							content: 'Hai, apa kabar',
							date: '2021-08-08T07:22:33.555Z',
							username: 'dicoding',
							is_delete: true,
						}),
					],
				}),
				new CommentDetail({
					id: 'comment-124',
					username: 'dicoding',
					date: '2021-08-08T07:22:33.555Z',
					content: 'comment',
					is_delete: true,
					like_count: 0,
					replies: [
						new ReplyDetail({
							id: 'reply-124',
							content: 'Test reply',
							date: '2021-08-08T07:22:33.555Z',
							username: 'dicoding',
							is_delete: false,
						}),
					],
				}),
			],
		}

		//const expectedGetedThread = new GetedThread(expectedThreadDetails);

		/** creating dependency of use case */
		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()
		const mockReplyRepository = new ReplyRepository()

		/** mocking needed function */
		mockThreadRepository.getThreadById = jest.fn(() =>
			Promise.resolve({
				id: 'thread-123',
				title: 'dicoding',
				body: 'Dicoding-Indonesia',
				date: '2021-08-08T07:19:09.775Z',
				username: 'dicoding',
			})
		)

		mockCommentRepository.getCommentByThreadId = jest.fn(() =>
			Promise.resolve([
				{
					id: 'comment-123',
					thread_id: 'thread-123',
					username: 'dicoding',
					date: '2021-08-08T07:22:33.555Z',
					content: 'sebuah comment',
					is_delete: false,
					like_count: 0,
				},
				{
					id: 'comment-124',
					thread_id: 'thread-123',
					content: 'comment',
					date: new Date('2021-08-08T07:22:33.555Z'),
					username: 'dicoding',
					is_delete: true,
					like_count: 0,
				},
			])
		)

		mockReplyRepository.getRepliesByThreadId = jest.fn(() =>
			Promise.resolve([
				{
					id: 'reply-123',
					comment_id: 'comment-123',
					content: 'Hai, apa kabar',
					date: '2021-08-08T07:22:33.555Z',
					username: 'dicoding',
					is_delete: true,
				},
				{
					id: 'reply-124',
					comment_id: 'comment-124',
					content: 'Hai, apa kabar',
					date: '2021-08-08T07:22:33.555Z',
					username: 'dicoding',
					is_delete: false,
				},
			])
		)

		/** creating use case instance */
		const getThreadUseCase = new DetailThreadUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
			replyRepository: mockReplyRepository,
		})

		// Action
		const gettedThread = await getThreadUseCase.execute(threadId)

		// Assert
		expect(gettedThread.id).toEqual(expectedThreadDetails.id)
		expect(gettedThread.body).toEqual(expectedThreadDetails.body)
		expect(gettedThread.date).toEqual(expectedThreadDetails.date)
		expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId)
		expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(
			threadId
		)
		expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
			threadId
		)
	})
})
