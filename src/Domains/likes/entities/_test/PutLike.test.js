const PutLike = require('../PutLike')

describe('a PutLike entities', () => {
	it('should throw error when payload did not contain needed property', () => {
		// Arrange
		const payload = {
			threadId: 'abc',
		}

		// Action and Assert
		expect(() => new PutLike(payload)).toThrowError(
			'PUT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'
		)
	})

	it('should throw error when payload did not meet data type specification', () => {
		// Arrange
		const payload = {
			threadId: 123,
			commentId: 'thread-123',
			credentialId: 'user-123',
		}

		// Action and Assert
		expect(() => new PutLike(payload)).toThrowError(
			'PUT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})

	it('should create PutLike object correctly', () => {
		// Arrange
		const payload = {
			threadId: 'dicoding',
			commentId: 'thread-123',
			credentialId: 'user-123',
		}

		// Action
		const { commentId, credentialId } = new PutLike(payload)

		// Assert
		expect(commentId).toEqual(payload.commentId)
		expect(credentialId).toEqual(payload.credentialId)
	})
})
