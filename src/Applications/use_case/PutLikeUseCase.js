const PutLike = require('../../Domains/likes/entities/PutLike')

class PutLikeUseCase {
	constructor({ threadRepository, commentRepository, likeRepository }) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
		this._likeRepository = likeRepository
	}

	async execute(threadId, commentId, credentialId) {
		const putLike = new PutLike({ threadId, commentId, credentialId })
		// validate threadId
		await this._threadRepository.getThreadById(threadId)
		// validate commentId
		await this._commentRepository.getCommentById(commentId)
		const availableLikes = await this._likeRepository.verifyLikeOwner(
			putLike
		)
		if (availableLikes.length) {
			return await this._likeRepository.deleteLike(putLike)
		} else {
			return await this._likeRepository.addLike(putLike)
		}
	}
}

module.exports = PutLikeUseCase
