const { ObjectId } = require('mongodb').ObjectId;

const Request = require('./request-class');

class NextPlacesToken {
  constructor(dbDatas) {
    this._id = new ObjectId();
    this.requestId = '';
    this.request = new Request();
    this.startPosition = 0;
    this.endPosition = 0;
    this.nextPlacesToken = '';
    if (dbDatas !== undefined) this.populateDatasFromDb(dbDatas);
  }

  populateDatasFromDb(dbDatas) {
    this._id = dbDatas._id;
    this.requestId = dbDatas.requestId;
    this.request = dbDatas.request;
    this.startPosition = dbDatas.startPosition;
    this.endPosition = dbDatas.endPosition;
    this.nextPlacesToken = dbDatas.nextPlacesToken;
  }
}

module.exports = NextPlacesToken;
