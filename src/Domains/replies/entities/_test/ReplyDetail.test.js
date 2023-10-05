const ReplyDetail = require('../ReplyDetail')

describe('a ReplyDetail entities', () => {
	it('should throw error when payload did not contain needed property', () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: 'ini content',
			username: 'user-123',
		}

		// Action and Assert
		expect(() => new ReplyDetail(payload)).toThrowError(
			'REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
		)
	})

	it('should throw error when payload did not meet data type specification', () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: true,
			date: [],
			username: 'dicoding',
			is_delete: false,
		}

		// Action and Assert
		expect(() => new ReplyDetail(payload)).toThrowError(
			'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})

	it('should create ReplyDetail object correctly', () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: 'content reply',
			date: '2022-04-23T07:09:31.383+07:00',
			username: 'user',
			is_delete: false,
		}

		// Action
		const { id, content, username } = new ReplyDetail(payload)

		// Assert
		expect(id).toEqual(payload.id)
		expect(content).toEqual(payload.content)
		expect(username).toEqual(payload.username)
	})

	it('should create ReplyDetail object when comment is deleted correctly', () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: 'content reply',
			date: '2022-04-23T07:09:31.383+07:00',
			username: 'user',
			is_delete: true,
		}

		// Action
		const { id, content, date, username } = new ReplyDetail(payload)

		// Assert
		expect(id).toEqual('reply-123')
		expect(content).toEqual('**balasan telah dihapus**')
		expect(date).toEqual('2022-04-23T07:09:31.383+07:00')
		expect(username).toEqual('user')
	})

	it('should create ReplyDetail object when comment is not deleted correctly', () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: 'content reply',
			date: '2022-04-23T07:09:31.383+07:00',
			username: 'user',
			is_delete: false,
		}

		// Action
		const { id, content, date, username } = new ReplyDetail(payload)

		// Assert
		expect(id).toEqual('reply-123')
		expect(content).toEqual('content reply')
		expect(date).toEqual('2022-04-23T07:09:31.383+07:00')
		expect(username).toEqual('user')
	})
})
