const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{owner}',
    handler: handler.postThreadHandler,
  },
]);

module.exports = routes;
