const apiUtils = require('../services/apiUtils');
const { BadRequest } = require('@feathersjs/errors');

const apiErrors = {
  validType: 'Please enter a valid type',
  validRadius: 'Please enter a valid radius',
  validLocation: 'Please enter a valid location'
};

function beforeFindHook(options = {}) {
  return async context => {
    const typesSrv = context.app.service('types');
    const requestsSrv = context.app.service('requests');
    //const nextPlacesTokensSrv = context.app.service('next-places-tokens');
    const query = context.params.query;

    if (!query.nextPlacesToken) {
      //nextPlacesToken will be defined if th user clicked on "more results"
      let newQuery = {};

      /**Fix Type */
      if (typeof query.typeId !== 'string')
        throw new BadRequest(apiErrors.validType);
      newQuery.type = await typesSrv.get(query.typeId);

      /**Fix Radius */
      if (query.radius <= 1750) {
        newQuery.radius = 1000;
      } else if (query.radius > 1750 && query.radius <= 3750) {
        newQuery.radius = 2500;
      } else {
        newQuery.radius = 5000;
      }

      /**Fix Location */
      if (typeof query.location !== 'string')
        throw new BadRequest(apiErrors.validLocation);

      let town = await apiUtils.getTown(query.location);

      newQuery.location = {
        lat: town.geometry.location.lat,
        lng: town.geometry.location.lng
      };

      //create requetsQuery
      newQuery.requestsQuery = {
        town: town.name,
        radius: newQuery.radius,
        typeId: newQuery.type._id
      };

      //search an already saved requestsQuery with the one we just created
      let lstRequests = await requestsSrv.find({
        query: newQuery.requestsQuery
      });

      if (lstRequests.length > 0) {
        //an already saved query has been found
        newQuery.isNewRequest = false;

        //the user research has been already done and saved before
        newQuery.request = lstRequests[0];
      } else {
        //the user research has never been done and saved before
        newQuery.isNewRequest = true;
      }

      context.params.query = newQuery;
    }

    return context;
  };
}

function afterFindHook(options = {}) {
  return async context => {
    const query = context.params.query;
    const placesSrv = context.app.service('places');

    //the datas we want to return to the user
    let returnValue = {
      nextPlacesToken: query.nextPlacesToken,
      origin: query.location,
      places: []
    };

    //if he user research has never been done before
    if (query.isNewRequest) {
      //get the return places from external-api.class
      returnValue.places = context.result;
    } else {
      //else get all placesIds
      let placesIds = context.result;
      //and map them into places

      for (let placeId of placesIds) {
        returnValue.places.push(await placesSrv.get(placeId));
      }
    }

    //the datas the user will get
    context.result = returnValue;

    return context;
  };
}

module.exports = {
  beforeFindHook: beforeFindHook,
  afterFindHook: afterFindHook
};
