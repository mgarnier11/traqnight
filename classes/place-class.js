const { ObjectId } = require('mongodb').ObjectId;
const Type = require('./type-class');

class Place {
  static get errors() {
    return {
      invalidId: Error('Invalid Id'),
      invalidRating: Error('Invalid Rating'),
      invalidPriceLevel: Error('Invalid PriceLevel'),
      invalidLocation: Error('Invalid Location'),
      invalidName: Error('Invalid Name'),
      invalidUrl: Error('Invalid Url'),
      invalidAddress: Error('Invalid Address'),
      invalidType: Error('Invalid Type'),
      invalidCreationDate: Error('Invalid Creation Date'),
      invalidUpdateDate: Error('Invalid Update Date')
    };
  }

  constructor(dbDatas) {
    this._id = new ObjectId();
    this.id = '';
    this.rating = '';
    this.priceLevel = '';
    this.location = '';
    this.name = '';
    this.url = '';
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
    this.type = new Type();
    this.creationDate = new Date();
    this.updateDate = new Date();
  }
}
