const PutLikeUseCase = require('../../../../Applications/use_case/PutLikeUseCase')

class LikesHandler {
	constructor(container) {
		this._container = container

		this.putLikeHandler = this.putLikeHandler.bind(this)
	}

	async putLikeHandler(request, h) {
		const putLikeUseCase = this._container.getInstance(PutLikeUseCase.name)
		const { id: credentialId } = request.auth.credentials
		const { threadId, commentId } = request.params

		const status = await putLikeUseCase.execute(
			threadId,
			commentId,
			credentialId
		)

		const response = h.response(status)
		response.code(200)
		return response
	}
}

module.exports = LikesHandler
