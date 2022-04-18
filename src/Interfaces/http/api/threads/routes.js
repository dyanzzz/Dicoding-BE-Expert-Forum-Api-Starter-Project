const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{owner}',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forum_jwt',
    },
  },
]);

module.exports = routes;
