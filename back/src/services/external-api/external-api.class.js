const {
  MethodNotAllowed,
  BadRequest,
  GeneralError
} = require('@feathersjs/errors');
const apiUtils = require('../apiUtils');

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    try {
      if (params.query.newRequest) {
      }

      let location = params.query.location;
      let type = params.query.type;
      let keyword = params.query.type.name;
      let radius =
        params.query.radius === undefined ? 1000 : params.query.radius;

      const lookupObj = {};

      let res = {
        origin: location,
        results: (await apiUtils.getHereResults(
          location,
          radius,
          keyword
        )).filter(x => {
          let ret = !lookupObj[x.id];
          lookupObj[x.id] = true;
          if (!ret) {
          }
          return ret;
        })
      };

      for (let result of res.results) {
        //result.distance = ;
        result.geometry = {
          location: {
            lat: result.position[0],
            lng: result.position[1]
          }
        };
        result.name = result.title;
        result.type = params.query.type;
      }
      return res;
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequest) throw error;
      else throw new GeneralError('API error');
    }
  }

  async get(id, params) {
    throw new MethodNotAllowed(
      "Get method is not allowed in the google's service"
    );
  }

  async create(data, params) {
    throw new MethodNotAllowed(
      "Create method is not allowed in the google's service"
    );
  }

  async update(id, data, params) {
    throw new MethodNotAllowed(
      "Update method is not allowed in the google's service"
    );
  }

  async patch(id, data, params) {
    throw new MethodNotAllowed(
      "Patch method is not allowed in the google's service"
    );
  }

  async remove(id, params) {
    throw new MethodNotAllowed(
      "Remove method is not allowed in the google's service"
    );
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
