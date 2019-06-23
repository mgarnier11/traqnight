const NextPlacesToken = require('../../../classes/nextPlacesToken-class');

function afterAllHook(options = {}) {
  return async context => {
    let nextPlacesTokens =
      context.method === 'find' ? context.result : [context.result];

    for (let nextPlacesToken of nextPlacesTokens) {
      nextPlacesToken.request = await context.app
        .service('requests')
        .get(nextPlacesToken.requestId);
    }

    if (context.method === 'find') {
      let newResults = [];

      for (let nextPlacesToken of context.result) {
        newResults.push(new NextPlacesToken(nextPlacesToken));
      }

      context.result = newResults;
    } else {
      context.result = new NextPlacesToken(context.result);
    }

    return context;
  };
}

module.exports = {
  afterAllHook: afterAllHook
};
