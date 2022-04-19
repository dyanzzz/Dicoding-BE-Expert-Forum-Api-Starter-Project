class DetailThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    return this._threadRepository.getDetailThreadById(threadId);
  }
}

module.exports = DetailThreadUseCase;
