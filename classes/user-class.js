const { ObjectId } = require('mongodb').ObjectId;

class User {
  constructor(dbDatas) {
    this._id = new ObjectId();
    this.email = '';
    this.name = '';
    this.password = '';
    this.admin = false;
    if (dbDatas !== undefined) this.populateDatasFromDb(dbDatas);
  }

  populateDatasFromDb(dbDatas) {
    this._id = dbDatas._id;
    this.email = dbDatas.email;
    this.name = dbDatas.name;
    this.password = dbDatas.password;
    this.admin = dbDatas.admin;
  }
}

module.exports = User;
