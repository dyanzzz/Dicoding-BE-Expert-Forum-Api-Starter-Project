const PuttedLike = require('../PuttedLike')

describe('a PuttedLike entities', () => {
	it('should throw error when payload did not contain needed property', () => {
		// Arrange
		const status = null

		// Action and Assert
		expect(() => new PuttedLike(status)).toThrowError(
			'PUT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'
		)
	})

	it('should throw error when payload did not meet data type specification', () => {
		// Arrange
		const status = true

		// Action and Assert
		expect(() => new PuttedLike(status)).toThrowError(
			'PUT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})

	it('should create PuttedLike object correctly', () => {
		// Arrange
		const status = 'success'

		// Action
		const payload = new PuttedLike(status)

		// Assert
		expect(payload.status).toEqual(status)
	})
})
