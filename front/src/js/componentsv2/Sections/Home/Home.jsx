import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { getPlaces } from '../../../redux/actions/place-actions';

const mapStateToProps = state => {
  return {
    types: state.typesRequest.types,
    placesLoading: state.placesRequest.loading
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getPlaces: params => dispatch(getPlaces(params))
  };
}

class Home extends Component {
  static propTypes = {
    types: PropTypes.arrayOf(PropTypes.object).isRequired,
    scrollTo: PropTypes.func.isRequired
  };

  static defaultProps = {
    types: [],
    scrollTo: p => console.log(p)
  };

  constructor(props) {
    super(props);

    this.defaultModal = {
      isOpen: true,
      name: '',
      email: '',
      password: ''
    };

    this.state = {
      type: '',
      location: '',
      modal: this.defaultModal
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.setModal = this.setModal.bind(this);

    this.loginSubmit = this.loginSubmit.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
  }

  setModal(params, cb) {
    this.setState(
      {
        modal: Object.assign({}, this.state.modal, params)
      },
      cb
    );
  }

  openModal() {
    document.body.style.overflowY = 'hidden';
    this.setModal({ isOpen: true });
  }

  closeModal() {
    document.body.style.overflowY = 'auto';
    this.setModal({ isOpen: false });
  }

  loginSubmit(event) {
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleLoginChange(event) {
    this.setModal({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.props.placesLoading) {
      const { type, location } = this.state;
      this.props.getPlaces({
        typeId: type === '' ? this.props.types[0]._id : type,
        location,
        radius: 1000
      });
      this.props.scrollTo('results');
    }
  }

  render() {
    const { type, location } = this.state;

    return (
      <div className="home container-fluid" ref={this.props.reference}>
        <nav className="navbar navbar-light">
          <img
            className="mr-auto"
            src={window.favicon}
            width="30"
            height="30"
            alt=""
          />
          <span className="user" onClick={this.openModal}>
            <i className="fas fa-user" />
          </span>
        </nav>
        <div className="container">
          <div className="title text-center">
            <h1>Explorez votre ville</h1>
            <h2>Ne cherchez plus où sortir! Trouvez!</h2>
          </div>

          <form className="form" onSubmit={this.handleSubmit}>
            <div className="form-group mx-md-5 px-md-5">
              <label htmlFor="type">
                <h3>Quoi ?</h3>
              </label>
              <select
                className="form-control"
                id="type"
                value={type}
                onChange={this.handleChange}
              >
                {this.props.types.map(t => {
                  return (
                    <option value={t._id} key={t._id}>
                      {t.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group mx-md-5 px-md-5">
              <label htmlFor="location">
                <h3>Ou ?</h3>
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                placeholder="Votre ville"
                value={location}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group text-center">
              <button
                type="submit"
                className="btn btn-lg btn-light"
                disabled={this.props.placesLoading}
              >
                Trouvez !
              </button>
            </div>
          </form>
        </div>

        <Modal
          isOpen={this.state.modal.isOpen}
          onRequestClose={this.closeModal}
          className="user-modal"
          contentLabel="Example Modal"
        >
          <h1 className="text-center">Log In</h1>
          <form className="form" onSubmit={this.loginSubmit}>
            <div className="form-label-group my-2">
              <label htmlFor="email">Email address</label>

              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Email address"
                value={this.state.modal.email}
                onChange={this.handleLoginChange}
                required
                autoFocus
              />
            </div>

            <div className="form-label-group my-2">
              <label htmlFor="password">Password</label>

              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Password"
                value={this.state.modal.password}
                onChange={this.handleLoginChange}
                required
              />
            </div>
            <button
              className="btn btn-lg btn-primary btn-block text-uppercase mt-4"
              type="submit"
            >
              Log in
            </button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
