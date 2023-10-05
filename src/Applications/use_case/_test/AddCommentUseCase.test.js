const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../../Domains/comments/CommentsRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
	it('should orchestrating the add comment action correctly', async () => {
		// Arrange
		const owner = 'user-123'
		const threadId = 'thread-123'
		const useCasePayload = {
			content: 'dicoding',
			threadId: threadId,
			owner: owner,
		}

		const expectedAddedComment = new AddedComment({
			id: 'thread-123',
			content: useCasePayload.content,
			owner: useCasePayload.owner,
		})

		/** creating dependency of use case */
		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()

		/** mocking needed function */
		mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve())
		mockCommentRepository.addComment = jest.fn(() =>
			Promise.resolve(
				new AddedComment({
					id: 'thread-123',
					content: useCasePayload.content,
					owner: useCasePayload.owner,
				})
			)
		)

		/** creating use case instance */
		const getCommentUseCase = new AddCommentUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
		})

		// Action
		const addedComment = await getCommentUseCase.execute(
			useCasePayload,
			useCasePayload.threadId,
			useCasePayload.owner
		)

		// Assert
		expect(addedComment).toStrictEqual(expectedAddedComment)
		expect(mockThreadRepository.getThreadById).toBeCalledWith(
			useCasePayload.threadId
		)
		expect(mockCommentRepository.addComment).toBeCalledWith(
			new AddComment({
				content: useCasePayload.content,
				threadId: useCasePayload.threadId,
				owner: useCasePayload.owner,
			})
		)
	})
})
