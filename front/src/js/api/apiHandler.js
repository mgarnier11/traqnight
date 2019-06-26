import io from 'socket.io-client';
import feathers from '@feathersjs/client';
import { EventEmitter } from 'events';
import Place from '../../../../classes/place-class';

class Handler {
  constructor() {
    // eslint-disable-next-line no-undef
    this.socket = io(apiUrl, {
      transports: ['websocket'],
      forceNew: true
    });
    this.feathers = feathers();

    this.feathers.configure(feathers.socketio(this.socket));

    this.feathers.configure(
      feathers.authentication({
        storage: window.localStorage
      })
    );

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);

    this.userService = this.feathers.service('users');
    this.googleService = this.feathers.service('external-api');
    this.typeService = this.feathers.service('types');

    this.googleService.timeout = 200000;

    this.events = new EventEmitter();
  }

  async performRequest(requestParams) {
    let apiQuery = {
      query: requestParams
    };

    let apiResponse = await this.googleService.find(apiQuery);
    apiResponse.places = apiResponse.places.map(place => {
      return new Place(place);
    });

    return apiResponse;
  }

  async isAuthenticated() {
    if (
      this.feathers.passport.payloadIsValid(
        await this.feathers.passport.getJWT()
      )
    ) {
      if (await this.feathers.get('user')) {
        return true;
      } else if ((await this.login()) === null) {
        return true;
      }
    }
    return false;
  }

  async logout() {
    await this.feathers.passport.getJWT();
    await this.feathers.logout();
  }

  async login(credentials) {
    let response = undefined;

    if (credentials) {
      let options = Object.assign(
        {
          strategy: 'local'
        },
        credentials
      );
      response = await this.feathers.authenticate(options);
    } else {
      response = await this.feathers.authenticate();
    }

    if (response && response.accessToken) {
      let payload = await this.feathers.passport.verifyJWT(
        response.accessToken
      );

      if (payload && payload.userId) {
        let user = await this.feathers.service('users').get(payload.userId);

        this.feathers.set('user', user);

        return true;
      }
    }

    return false;
  }

  async register(credentials) {
    try {
      await this.feathers.service('users').create(credentials);

      return null;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
}

const apiHandler = new Handler();

export default apiHandler;
