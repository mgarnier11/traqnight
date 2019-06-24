const { ObjectId } = require('mongodb').ObjectId;
const Type = require('./type-class');

class Place {
  constructor(dbDatas) {
    this._id = new ObjectId();
    this.hereId = '';
    this.placeId = '';
    this.typeIds = [];
    this.rating = '';
    this.priceLevel = '';
    this.location = {};
    this.name = '';
    this.address = '';
    this.types = [];
    this.creationDate = new Date();
    this.updateDate = new Date();
    if (dbDatas !== undefined) this.populateDatasFromDb(dbDatas);
  }

  populateDatasFromDb(dbDatas) {
    this._id = dbDatas._id;
    this.hereId = dbDatas.hereId;
    this.placeId = dbDatas.placeId;
    this.typeIds = dbDatas.typeIds;
    this.rating = dbDatas.rating;
    this.priceLevel = dbDatas.priceLevel;
    this.location = dbDatas.location;
    this.name = dbDatas.name;
    this.address = dbDatas.address;
    this.types = dbDatas.types;
    this.creationDate = dbDatas.creationDate;
    this.updateDate = dbDatas.updateDate;
  }
}

module.exports = Place;
