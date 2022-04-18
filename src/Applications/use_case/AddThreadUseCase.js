const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    useCasePayload.owner = owner
    const addThread = new AddThread(useCasePayload);
    await this._threadRepository.verifyAvailableTitle(addThread.title);
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
