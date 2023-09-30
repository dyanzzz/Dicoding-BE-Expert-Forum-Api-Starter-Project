const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'dicoding',
      date: '2022-04-21T14:47:50.725+07:00',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123123,
      content: 'dicoding',
      date: '2022-04-21T14:47:50.725+07:00',
      username: 'dicoding',
      replies: []
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'dicoding',
      date: '2022-04-21T14:47:50.725+07:00',
      username: 'dicoding',
      is_delete: false,
      replies: []
    };

    // Action
    const { content, username } = new CommentDetail(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(username).toEqual(payload.username);
  });

  it('should create CommentDetail object when comment is deleted correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'dicoding',
      date: '2022-04-21T14:47:50.725+07:00',
      username: 'dicoding',
      is_delete: true,
      replies: []
    };
  
    // Action
    const { id, content, date, username, replies } = new CommentDetail(payload);
  
    // Assert
    expect(id).toEqual('comment-123');
    expect(content).toEqual('**komentar telah dihapus**');
    expect(date).toEqual('2022-04-21T14:47:50.725+07:00');
    expect(username).toEqual('dicoding');
    expect(replies).toEqual([]);
  });
  
  it('should create CommentDetail object when comment is not deleted correctly', () => { 
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'dicoding',
      date: '2022-04-21T14:47:50.725+07:00',
      username: 'dicoding',
      is_delete: false,
      replies: []
    };
  
    // Action
    const { id, content, date, username, replies } = new CommentDetail(payload);
  
    // Assert
    expect(id).toEqual('comment-123');
    expect(content).toEqual('dicoding');
    expect(date).toEqual('2022-04-21T14:47:50.725+07:00');
    expect(username).toEqual('dicoding');
    expect(replies).toEqual([]);
  });

});