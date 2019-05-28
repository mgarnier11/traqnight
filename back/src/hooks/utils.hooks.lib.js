const { BadRequest } = require('@feathersjs/errors');


function checkAdmin(options = {}) {
  return async context => {
    let user = context.params.user;

    if (!user.admin) throw new BadRequest('Admin only');

    return context;
  };
}

function startLog() {
  return async context => {
    console.time(context.method + context.path);

    return context;
  };
}

function endLog() {
  return async context => {
    console.timeEnd(context.method + context.path);

    return context;
  };
}

// eslint-disable-next-line no-unused-vars
module.exports = {
  checkAdmin: checkAdmin,
  startLog: startLog,
  endLog: endLog
};