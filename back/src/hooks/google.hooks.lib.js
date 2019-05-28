function beforeFindHook(options = {}) {
    return async context => {
        context.params.query.type = await context.app.service('types').get(context.params.query.type);

        return context;
    };
}

module.exports = {
    beforeFindHook: beforeFindHook
};