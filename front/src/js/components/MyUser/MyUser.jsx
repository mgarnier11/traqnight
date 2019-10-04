import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import {
  updateUser,
  removeUser,
  logout
} from '../../redux/actions/auth-actions';

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    authLoading: state.auth.loading
  };
};

function mapDispatchToProps(dispatch) {
  return {
    updateUser: (id, userDatas) => dispatch(updateUser(id, userDatas)),
    removeUser: id => dispatch(removeUser(id)),
    logout: () => dispatch(logout())
  };
}

class MyUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      confirmPassword: ''
    };

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.updateInfos = this.updateInfos.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user) this.setState({ user: newProps.user });
  }

  handleUserChange(event) {
    let user = this.state.user;
    user[event.target.id] = event.target.value;
    this.setState({ user });
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  updateInfos() {
    this.props
      .updateUser(this.state.user._id, {
        name: this.state.user.name,
        email: this.state.user.email
      })
      .then(() => {
        toast.success('Your informations has been updated successfully', {
          position: 'bottom-center',
          autoClose: 4000,
          pauseOnHover: false,
          pauseOnFocusLoss: false
        });
      });
  }

  updatePassword() {
    this.props
      .updateUser(this.state.user._id, {
        password: this.state.user.password,
        confirmPassword: this.state.confirmPassword
      })
      .then(() => {
        toast.success(
          'Your password has been updated successfully, please log in again',
          {
            position: 'bottom-center',
            autoClose: 4000,
            pauseOnHover: false,
            pauseOnFocusLoss: false
          }
        );

        this.props.logout();
      });
  }

  render() {
    const { user, confirmPassword } = this.state;

    return (
      <>
        <div className="container">
          <h2 className="text-center m-4">Update your informations</h2>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Name"
              value={user.name}
              onChange={this.handleUserChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mail">Email</label>
            <input
              type="email"
              className="form-control"
              id="mail"
              placeholder="Email"
              value={user.email}
              onChange={this.handleUserChange}
            />
          </div>

          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.updateInfos}
            >
              Update Informations
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              autoComplete="new-password"
              value={user.password}
              onChange={this.handleUserChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={this.handleChange}
            />
          </div>
          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary"
              disabled={confirmPassword !== user.password || !user.password}
              onClick={this.updatePassword}
            >
              Update Password
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyUser);
