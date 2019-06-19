class Place {
  constructor(oldResult = undefined) {
    if (oldResult !== undefined) {
      this.rating = oldResult.rating;
      this.priceLevel = oldResult.priceLevel;
      this.location = {
        lat: oldResult.location.lat,
        lng: oldResult.location.lng
      };
      this.name = oldResult.name;
      this.url = oldResult.url;
      this.address = oldResult.address;
      this.typeId = oldResult.typeId;
      this.type = oldResult.type;
      this.id = oldResult.id;
    } else {
      this.rating = 0;
      this.priceLevel = 0;
      this.location = { lat: 0, lng: 0 };
      this.name = '';
      this.url = '';
      this.address = '';
      this.typeId = '';
      this.type = undefined;
      this.id = '';
    }
  }

  setValuesFromGoogle(obj) {
    this.rating = obj.rating;
    this.priceLevel = obj.price_level;
    this.location = {
      lat: obj.geometry.location.lat,
      lng: obj.geometry.location.lng
    };
    this.name = obj.name;
    this.address = obj.vicinity;
    this.typeId = obj.type._id;
    this.type = obj.type;
    this.id = obj.place_id;
    return this;
  }

  setValuesFromDb(obj) {
    this.rating = obj.rating;
    this.priceLevel = obj.priceLevel;
    this.location = {
      lat: obj.location.lat,
      lng: obj.location.lng
    };
    this.name = obj.name;
    this.url = obj.url;
    this.address = obj.address;
    this.typeId = obj.typeId;
    this.type = obj.type;
    this.id = obj.id;
    return this;
  }
}

module.exports = Place;
