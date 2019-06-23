const { ObjectId } = require('mongodb').ObjectId;
const Type = require('./type-class');

class Place {
  constructor(dbDatas) {
    this._id = new ObjectId();
    this.hereId = '';
    this.placeId = '';
    this.typeId = '';
    this.rating = '';
    this.priceLevel = '';
    this.location = {};
    this.name = '';
    this.address = '';
    this.type = new Type();
    this.creationDate = new Date();
    this.updateDate = new Date();
    if (dbDatas !== undefined) this.populateDatasFromDb(dbDatas);
  }

  populateDatasFromDb(dbDatas) {
    this._id = dbDatas._id;
    this.id = dbDatas.id;
    this.rating = dbDatas.rating;
    this.priceLevel = dbDatas.priceLevel;
    this.location = dbDatas.location;
    this.name = dbDatas.name;
    this.url = dbDatas.url;
    this.address = dbDatas.address;
    this.type = dbDatas.type;
    this.creationDate = dbDatas.creationDate;
    this.updateDate = dbDatas.updateDate;
  }
}

module.exports = Place;
