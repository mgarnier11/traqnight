const { ObjectId } = require('mongodb').ObjectId;

const User = require('./user-class');

class Type {
  constructor(dbDatas) {
    this._id = new ObjectId();
    this.name = '';
    this.googleType = '';
    this.fontAwesomeIcon = '';
    this.creationUser = new User();
    this.creationDate = new Date();
    this.updateUser = new User();
    this.updateDate = new Date();
    if (dbDatas !== undefined) this.populateDatasFromDb(dbDatas);
  }

  populateDatasFromDb(dbDatas) {
    this._id = dbDatas._id;
    this.name = dbDatas.name;
    this.googleType = dbDatas.googleType;
    this.fontAwesomeIcon = dbDatas.fontAwesomeIcon;
    this.creationUser = dbDatas.creationUser;
    this.creationDate = dbDatas.creationDate;
    this.updateUser = dbDatas.updateUser;
    this.updateDate = dbDatas.updateDate;
  }
}

module.exports = Type;
