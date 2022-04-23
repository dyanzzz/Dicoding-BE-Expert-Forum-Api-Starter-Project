class ReplyDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, is_delete: isDelete } = payload;
    
    this.id = id;
    this.content = (isDelete) ? '**balasan telah dihapus**' : content;
    this.date = date
    this.username = username;
  }

  _verifyPayload({ id, content, date, username, is_delete: isDelete }) {
    if (!id || !content || !date || !username) {
        throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
        typeof id !== 'string' ||
        typeof content !== 'string' ||
        typeof username !== 'string' ||
        typeof isDelete !== 'boolean'
    ) {
        throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyDetail;