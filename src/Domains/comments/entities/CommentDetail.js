class CommentDetail {
  constructor(payload) {
      this._verifyPayload(payload);

      const { id, content, date, username, is_delete: isDelete, replies } = payload;

      this.id = id;
      this.content = isDelete ? '**komentar telah dihapus**' : content;
      this.date = date;
      this.username = username;
      this.replies = replies;
  }

  _verifyPayload({
      id, content, date, username, is_delete: isDelete, replies
  }) {
      if (!id || !content || !date || !username || !replies ) {
          throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (
          typeof id !== 'string' || 
          typeof content !== 'string' ||
          typeof username !== 'string' || 
          typeof isDelete !== 'boolean' ||
          !(replies instanceof Array)
      ) {
          throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
  }
}

module.exports = CommentDetail;