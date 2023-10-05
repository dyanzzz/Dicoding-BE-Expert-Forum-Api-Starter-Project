const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentsRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const AddReply = require('../../../Domains/replies/entities/AddReply')
const AddReplyUseCase = require('../AddReplyUseCase')

describe('AddReplyUseCase', () => {
	it('should orchestrating the add reply action correctly', async () => {
		// Arrange
		const owner = 'user-123'
		const threadId = 'thread-123'
		const commentId = 'comment-123'
		const useCasePayload = {
			content: 'dicoding',
			owner,
			threadId,
			commentId,
		}

		/** creating dependency of use case */
		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()
		const mockReplyRepository = new ReplyRepository()

		/** mocking needed function */
		mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve())
		mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve())
		mockReplyRepository.addReply = jest.fn(() =>
			Promise.resolve({
				id: 'reply-123',
				content: useCasePayload.content,
				owner: useCasePayload.owner,
			})
		)

		/** creating use case instance */
		const getReplyUseCase = new AddReplyUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
			replyRepository: mockReplyRepository,
		})

		// Action
		const addedReply = await getReplyUseCase.execute(
			useCasePayload,
			useCasePayload.owner,
			useCasePayload.threadId,
			useCasePayload.commentId
		)

		// Assert
		expect(addedReply).toStrictEqual({
			id: 'reply-123',
			content: useCasePayload.content,
			owner: useCasePayload.owner,
		})
		expect(mockThreadRepository.getThreadById).toBeCalledWith(
			useCasePayload.threadId
		)
		expect(mockCommentRepository.getCommentById).toBeCalledWith(
			useCasePayload.commentId
		)
		expect(mockReplyRepository.addReply).toBeCalledWith(
			new AddReply({
				content: useCasePayload.content,
				owner: useCasePayload.owner,
				threadId: useCasePayload.threadId,
				commentId: useCasePayload.commentId,
			})
		)
	})
})
