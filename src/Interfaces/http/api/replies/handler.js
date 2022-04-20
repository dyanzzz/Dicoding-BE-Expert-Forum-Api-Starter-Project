const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params
    
    const addedReply = await addReplyUseCase.execute(request.payload, credentialId, threadId, commentId);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

}

module.exports = CommentsHandler;
