const { ObjectId } = require('mongodb').ObjectId;

class Request {
  constructor(dbDatas) {
    this._id = new ObjectId();
    this.town = '';
    this.radius = 0;
    this.typeId = '';
    this.placesIds = [];
    this.nextPlacesToken = '';
    if (dbDatas !== undefined) this.populateDatasFromDb(dbDatas);
  }

  populateDatasFromDb(dbDatas) {
    this._id = dbDatas._id;
    this.town = dbDatas.town;
    this.radius = dbDatas.radius;
    this.typeId = dbDatas.typeId;
    this.placesIds = dbDatas.placesIds;
    this.nextPlacesToken = dbDatas.nextPlacesToken;
  }
}

module.exports = Request;
