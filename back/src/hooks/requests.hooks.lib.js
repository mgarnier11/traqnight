const Request = require('../../../classes/request-class');

function afterAllHook(options = {}) {
  return async context => {
    if (context.method === 'find') {
      let newResults = [];

      for (let request of context.result) {
        newResults.push(new Request(request));
      }

      context.result = newResults;
    } else {
      context.result = new Request(context.result);
    }

    return context;
  };
}

module.exports = {
  afterAllHook: afterAllHook
};
