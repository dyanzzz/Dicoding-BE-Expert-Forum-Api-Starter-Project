class DetailThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getDetailThreadById(threadId);

    thread.comments.forEach((row, i) => {
      const content = (row.is_delete) ? "**komentar telah dihapus**" : row.content
      thread.comments[i].content = content
    });

    return thread;
  }
}

module.exports = DetailThreadUseCase;
