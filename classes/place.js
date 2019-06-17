class Place {
  constructor() {
    this.rating = 0;
    this.priceLevel = undefined;
    this.location = { lat: undefined, lng: undefined };
    this.name = '';
    this.url = '';
    this.address = '';
    this.typeId = '';
    this.type = undefined;
    this.id = '';
  }

  setValuesFromGoogle(obj) {
    this.rating = obj.rating | undefined;
    this.priceLevel = obj.price_level | undefined;
    console.log(obj.geometry.location);
    this.location = {
      lat: obj.geometry.location.lat | undefined,
      lng: obj.geometry.location.lng | undefined
    };
    console.log(this.location);
    this.name = obj.name | '';
    this.url = undefined;
    this.address = obj.vicinity | '';
    this.typeId = obj.type._id;
    this.type = obj.type;
    this.id = obj.id;
    return this;
  }

  setValuesFromDb(obj) {
    this.rating = obj.rating | undefined;
    this.priceLevel = obj.priceLevel | undefined;
    this.location = {
      lat: obj.location.lat | undefined,
      lng: obj.location.lng | undefined
    };
    this.name = obj.name | '';
    this.url = obj.url | '';
    this.address = obj.address | '';
    this.typeId = obj.typeId;
    this.type = obj.type;
    this.id = obj.id;
    return this;
  }
}

let place = new Place();

module.exports = Place;
