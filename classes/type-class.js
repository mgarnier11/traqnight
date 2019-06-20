const validator = require('validator');
const { BadRequest } = require('@feathersjs/errors');
const { ObjectId } = require('mongodb').ObjectId;
const googlePlacesTypes = require('../front/src/json/googleplaces.json');
const fontAwesomeIcons = require('../front/src/json/fontawesome.json');

const User = require('./user-class');

class Type {
  static errors = {
    invalidId: 'Invalid Id',
    invalidName: 'Invalid Name',
    invalidGoogleType: 'Invalid Google Type',
    invalidFontAwesomeIcon: 'Invalid FontAwesome Icon',
    invalidCreationUser: 'Invalid Creation User',
    invalidCreationDate: 'Invalid Creation Date',
    invalidUpdateUser: 'Invalid Update User',
    invalidUpdateDate: 'Invalid Update Date'
  };

  constructor() {
    this._id = new ObjectId();
    this.name = '';
    this.googleType = '';
    this.fontAwesomeIcon = '';
    this.creationUser = new User();
    this.creationDate = new Date();
    this.updateUser = new User();
    this.updateDate = new Date();
  }

  valid() {
    /** validate Id*/
    if (validator.isEmpty(this._id))
      throw new BadRequest(Type.errors.invalidId);
    if (!this._id instanceof ObjectId)
      throw new BadRequest(Type.errors.invalidId);

    /** validate Name*/
    if (validator.isEmpty(this.name))
      throw new BadRequest(Type.errors.invalidName);

    /**validate GoogleType */
    if (validator.isEmpty(this.googleType))
      throw new BadRequest(Type.errors.invalidGoogleType);
    if (!googlePlacesTypes.includes(this.googleType))
      throw new BadRequest(Type.errors.invalidGoogleType);

    /**validate FontAwesomeIcon */
    if (validator.isEmpty(this.fontAwesomeIcon))
      throw new BadRequest(Type.errors.invalidFontAwesomeIcon);
    if (!fontAwesomeIcons.includes(this.fontAwesomeIcon))
      throw new BadRequest(Type.errors.invalidFontAwesomeIcon);

    /**validate CreationUser */
    if (validator.isEmpty(this.creationUser))
      throw new BadRequest(Type.errors.invalidCreationUser);
    if (!this.creationUser instanceof User)
      throw new BadRequest(Type.errors.invalidCreationUser);

    /**validate CreationDate */
    if (validator.isEmpty(this.creationDate))
      throw new BadRequest(Type.errors.invalidCreationDate);
    if (!this.creationDate instanceof Date)
      throw new BadRequest(Type.errors.invalidCreationDate);

    /**validate UpdateUser */
    if (validator.isEmpty(this.updateUser))
      throw new BadRequest(Type.errors.invalidUpdateUser);
    if (!this.updateUser instanceof User)
      throw new BadRequest(Type.errors.invalidUpdateUser);

    /**validate UpdateDate */
    if (validator.isEmpty(this.updateDate))
      throw new BadRequest(Type.errors.invalidUpdateDate);
    if (!this.updateDate instanceof Date)
      throw new BadRequest(Type.errors.invalidUpdateDate);

    return true;
  }

  updateFromDatas(newDatas) {
    if (newDatas._id !== undefined) this._id = newDatas._id;

    if (newDatas.name !== undefined) this.name = newDatas.name;

    if (newDatas.googleType !== undefined)
      this.googleType = newDatas.googleType;

    if (newDatas.fontAwesomeIcon !== undefined)
      this.fontAwesomeIcon = newDatas.fontAwesomeIcon;

    if (newDatas.creationUser !== undefined)
      this.creationUser = newDatas.creationUser;

    if (newDatas.creationDate !== undefined)
      this.creationDate = newDatas.creationDate;

    if (newDatas.updateUser !== undefined)
      this.updateUser = newDatas.updateUser;

    if (newDatas.updateDate !== undefined)
      this.updateDate = newDatas.updateDate;
  }

  toSave() {
    return {
      _id: this._id,
      name: this.name,
      googleType: this.googleType,
      fontAwesomeIcon: this.fontAwesomeIcon,
      creationUserId: this.creationUser._id,
      creationDate: this.creationDate,
      updateUserId: this.updateUser._id,
      updateDate: this.updateDate
    };
  }

  async load(datas, context) {
    this.creationUser = await context.app
      .service('users')
      .get(datas.creationUserId);
    this.updateUser = await context.app
      .service('users')
      .get(datas.updateUserId);

    this.updateFromDatas(datas);
    return this;
  }
}

export default Type;
