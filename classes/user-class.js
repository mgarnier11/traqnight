const validator = require('validator');
const { BadRequest } = require('@feathersjs/errors');
const { ObjectId } = require('mongodb').ObjectId;

class User {
  static errors = {
    invalidId: 'Invalid Id',
    invalidName: 'Invalid Name',
    invalidEmail: 'Invalid Email',
    invalidPassword: 'Invalid Password',
    invalidAdmin: 'Invalid Admin'
  };

  constructor() {
    this._id = new ObjectId();
    this.email = '';
    this.name = '';
    this.password = '';
    this.admin = false;
  }

  valid() {
    /** validate Id*/
    if (validator.isEmpty(this._id))
      throw new BadRequest(User.errors.invalidId);
    if (!this._id instanceof ObjectId)
      throw new BadRequest(User.errors.invalidId);

    /** validate Email*/
    if (validator.isEmpty(this.Email))
      throw new BadRequest(User.errors.invalidEmail);

    /** validate Name*/
    if (validator.isEmpty(this.name))
      throw new BadRequest(User.errors.invalidName);

    /** validate Password*/
    if (validator.isEmpty(this.password))
      throw new BadRequest(User.errors.invalidPassword);

    /** validate Admin*/
    if (validator.isBoolean(this.admin))
      throw new BadRequest(User.errors.invalidAdmin);

    return true;
  }

  updateFromDatas(newDatas) {
    this._id = newDatas._id;

    this.email = newDatas.email;

    this.name = newDatas.name;

    this.password = newDatas.password;

    this.admin = newDatas.admin;
  }

  toSave() {
    return {
      _id: this._id,
      email: this.email,
      name: this.name,
      password: this.password,
      admin: this.admin
    };
  }

  async load(datas, context) {
    this.updateFromDatas(datas);

    return this;
  }
}

export default User;
