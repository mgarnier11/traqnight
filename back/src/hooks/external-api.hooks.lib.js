const apiUtils = require("../services/apiUtils");
const { BadRequest } = require("@feathersjs/errors");

const apiErrors = {
  validType: "Please enter a valid type",
  validRadius: "Please enter a valid radius",
  validLocation: "Please enter a valid location"
};

function beforeFindHook(options = {}) {
  return async context => {
    const requestSrv = context.app.service("requests");
    const query = context.params.query;

    let newQuery = {};

    if (typeof query.type !== "string")
      throw new BadRequest(apiErrors.validType);
    newQuery.type = await context.app.service("types").get(query.type);

    if (typeof query.radius !== "number")
      throw new BadRequest(apiErrors.validRadius);

    if (query.radius <= 1750) {
      newQuery.radius = 1000;
    } else if (query.radius > 1750 && query.radius <= 3750) {
      newQuery.radius = 2500;
    } else {
      newQuery.radius = 5000;
    }

    if (typeof query.location === "string") {
      let town = await apiUtils.getTown(query.location);

      newQuery.location = {
        lat: town.geometry.location.lat,
        lng: town.geometry.location.lng
      };

      let requests = await requestSrv.find({
        query: {
          town: town.name,
          radius: newQuery.radius,
          type: newQuery.type._id
        }
      });

      if (requests.length > 0) {
        newQuery.newRequest = false;
        context.datas = "test";
      } else {
        newQuery.newRequest = true;
      }
    } else if (typeof query.location === "object") {
      if (typeof query.location.lat !== "number")
        throw new BadRequest(apiErrors.validLocation);
      if (typeof query.location.lng !== "number")
        throw new BadRequest(apiErrors.validLocation);

      newQuery.location = {
        lat: query.location.lat,
        lng: query.location.lng
      };
      newQuery.newRequest = true;
    } else {
      throw new BadRequest(apiErrors.validLocation);
    }

    context.params.query = newQuery;

    return context;
  };
}

function afterFindHook(options = {}) {
  return async context => {
    return context;
  };
}

module.exports = {
  beforeFindHook: beforeFindHook,
  afterFindHook: afterFindHook
};
