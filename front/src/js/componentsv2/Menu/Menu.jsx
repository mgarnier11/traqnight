import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import LoadingOverlay from 'react-loading-overlay';

import { login, logout } from '../../redux/actions/auth-actions';

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    authLoading: state.auth.loading
  };
};

function mapDispatchToProps(dispatch) {
  return {
    login: credentials => dispatch(login(credentials)),
    logout: () => dispatch(logout())
  };
}

class Menu extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.defaultModal = {
      isOpen: false,
      name: '',
      email: '',
      password: '',
      errorMessage: ''
    };

    this.state = {
      modal: this.defaultModal
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.setModal = this.setModal.bind(this);

    this.loginSubmit = this.loginSubmit.bind(this);
    this.logout = this.logout.bind(this);
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

    this.props.login({
      errors: true,
      credentials: {
        email: this.state.modal.email,
        password: this.state.modal.password
      }
    });
  }

  logout() {
    this.props.logout();
  }

  handleLoginChange(event) {
    this.setModal({ [event.target.id]: event.target.value });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user !== this.props.user) this.closeModal();
  }

  render() {
    const { user } = this.props;

    return (
      <div className="menu">
        <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
          <Link to="/" className="mr-auto">
            <img src={window.favicon} alt="" />
          </Link>
          {user ? (
            <>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#menuNavbarToggler"
                aria-controls="menuNavbarToggler"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div
                className="collapse navbar-collapse inline"
                id="menuNavbarToggler"
              >
                {user.admin ? this.renderAdmin(user) : this.renderUser(user)}
              </div>
            </>
          ) : (
            <ul class="navbar-nav">
              <li class="nav-item">
                <i
                  className="login-icon fas fa-user"
                  onClick={this.openModal}
                  style={{ color: '#000000' }}
                />
              </li>
            </ul>
          )}
        </nav>
        <Modal
          isOpen={this.state.modal.isOpen}
          onRequestClose={this.closeModal}
          className="my-modals"
          contentLabel="User Modal"
        >
          <LoadingOverlay
            active={this.props.authLoading}
            spinner
            text="Chargement..."
            className="loading-overlay"
          >
            <div className="modal-wrapper">
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
            </div>
          </LoadingOverlay>
        </Modal>
      </div>
    );
  }

  renderUser(user) {
    return (
      <ul class="navbar-nav">
        <li class="nav-item m-1 my-lg-0">
          <span className="btn btn-secondary">{user.name}</span>
        </li>
        <li class="nav-item m-1 my-lg-0">
          <span className="btn btn-secondary" onClick={this.logout}>
            Se déconnecter
            <i className="fas fa-sign-out-alt" />
          </span>
        </li>
      </ul>
    );
  }

  renderAdmin(user) {
    return (
      <ul class="navbar-nav">
        <li class="nav-item dropdown m-1 my-lg-0 admin">
          <button
            className="dropdown-toggle btn btn-secondary"
            id="navbarDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Admin
          </button>

          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link to="/admin/types" className="dropdown-item">
              Manage Types
            </Link>
            {/*<Link to="/admin" className="dropdown-item">
              List
    </Link>*/}
          </div>
        </li>
        <li class="nav-item m-1 my-lg-0">
          <span className="btn btn-secondary">{user.name}</span>
        </li>
        <li class="nav-item m-1 my-lg-0">
          <span className="btn btn-secondary" onClick={this.logout}>
            Se déconnecter
            <i className="fas fa-sign-out-alt" />
          </span>
        </li>
      </ul>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
