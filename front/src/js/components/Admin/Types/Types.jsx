import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import googleTypes from '../../../../json/googleplaces.json';
import hereCategories from '../../../../json/hereCategories.json';
import fontAwesomeIcons from '../../../../json/fontawesome.json';

import {
  createType,
  updateType,
  removeType
} from '../../../redux/actions/type-actions';

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    types: state.typesRequest.types
  };
};

function mapDispatchToProps(dispatch) {
  return {
    createType: typeDatas => dispatch(createType(typeDatas)),
    updateType: (id, typeDatas) => dispatch(updateType(id, typeDatas)),
    removeType: id => dispatch(removeType(id))
  };
}

class Types extends Component {
  constructor(props) {
    super(props);
    this.defaultModal = {
      isOpen: false,
      type: null
    };

    this.state = {
      deleteModal: this.defaultModal,
      upsertModal: this.defaultModal
    };

    this.setModal = this.setModal.bind(this);
    this.denyDeleteModal = this.denyDeleteModal.bind(this);
    this.acceptDeleteModal = this.acceptDeleteModal.bind(this);

    this.submitUpsert = this.submitUpsert.bind(this);
    this.handleUpsertChange = this.handleUpsertChange.bind(this);
    this.closeUpsertModal = this.closeUpsertModal.bind(this);
  }

  deleteType(type) {
    this.setModal('deleteModal', { isOpen: true, type });
  }

  updateType(type) {
    this.setModal('upsertModal', { isOpen: true, type });
  }

  createType() {
    this.setModal('upsertModal', {
      isOpen: true,
      type: {
        name: '',
        googleType: googleTypes[0],
        hereCategorie: hereCategories[0].id,
        fontAwesomeIcon: fontAwesomeIcons[0]
      }
    });
  }

  setModal(modal, params, cb) {
    let state = { ...this.state };

    state[modal] = Object.assign({}, state[modal], params);

    this.setState(state, cb);
  }

  render() {
    const { types } = this.props;
    return (
      <>
        <div className="container">
          <table className="table table-striped types-table">
            <thead className="thead-light">
              <tr>
                <th className="d-none d-lg-table-cell" scope="col">
                  Id
                </th>
                <th scope="col">Name</th>
                <th className="d-none d-md-table-cell" scope="col">
                  Google Type
                </th>
                <th className="d-none d-md-table-cell" scope="col">
                  Here Categorie
                </th>
                <th scope="col">Icon</th>
                <th className="d-none d-lg-table-cell" scope="col">
                  Update
                </th>
                <th className="d-none d-lg-table-cell" scope="col">
                  User
                </th>
                <th scope="col">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => this.createType()}
                  >
                    Create New Type
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {types.map(type => {
                const hereCategorie = hereCategories.find(
                  c => c.id === type.hereCategorie
                );

                return (
                  <tr>
                    <th scope="row" className="d-none d-lg-table-cell">
                      {type._id}
                    </th>
                    <td>{type.name}</td>
                    <td className="d-none d-md-table-cell">
                      {type.googleType}
                    </td>
                    <td className="d-none d-md-table-cell">
                      {hereCategorie ? hereCategorie.title : ''}
                    </td>
                    <td className="text-center">
                      <i className={'fas fa-' + type.fontAwesomeIcon} />
                    </td>
                    <td className="d-none d-lg-table-cell">
                      {new Date(type.updateDate).toDateString()}
                    </td>
                    <td className="d-none d-lg-table-cell">
                      {type.updateUser.name}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning mx-1 p-1"
                        onClick={() => this.updateType(type)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-sm btn-danger mx-1 p-1"
                        onClick={() => this.deleteType(type)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {this.renderDeleteModal()}
        {this.renderUpsertModal()}
      </>
    );
  }

  denyDeleteModal() {
    this.setModal('deleteModal', { isOpen: false, type: null });
  }

  acceptDeleteModal() {
    this.props.removeType(this.state.deleteModal.type._id);
    this.setModal('deleteModal', { isOpen: false, type: null });
  }

  renderDeleteModal() {
    const { deleteModal } = this.state;

    const { type } = deleteModal;

    return (
      <Modal
        isOpen={deleteModal.isOpen}
        onRequestClose={this.denyDeleteModal}
        className="my-modals"
        contentLabel="Confirm Modal"
      >
        <div className="modal-wrapper">
          <h1 className="text-center">Delete</h1>
          <h4 className="text-center">
            Are you sure you want to delete :{type ? ' ' + type.name : ''} ?
          </h4>
          <div className="row mt-3">
            <div className="col-6">
              <button
                className="btn btn-primary btn-block"
                onClick={this.denyDeleteModal}
              >
                No
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn btn-danger btn-block"
                onClick={this.acceptDeleteModal}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  submitUpsert(event) {
    event.preventDefault();

    if (this.state.upsertModal.type._id) {
      this.props.updateType(
        this.state.upsertModal.type._id,
        this.state.upsertModal.type
      );
    } else {
      this.props.createType(this.state.upsertModal.type);
    }

    this.setModal('upsertModal', { isOpen: false, type: null });
  }

  handleUpsertChange(event) {
    this.setModal('upsertModal', {
      type: Object.assign({}, this.state.upsertModal.type, {
        [event.target.id]: event.target.value
      })
    });
  }

  closeUpsertModal() {
    this.setModal('upsertModal', { isOpen: false, type: null });
  }

  renderUpsertModal() {
    const { upsertModal } = this.state;
    const {
      name,
      googleType,
      hereCategorie,
      fontAwesomeIcon
    } = upsertModal.type ? upsertModal.type : {};

    return (
      <Modal
        isOpen={upsertModal.isOpen}
        onRequestClose={this.closeUpsertModal}
        className="my-modals"
        contentLabel="Confirm Modal"
      >
        <div className="modal-wrapper">
          <h1 className="text-center">Update</h1>
          <form className="form" onSubmit={this.submitUpsert}>
            <div className="form-label-group my-2">
              <label htmlFor="name">Name</label>

              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={this.handleUpsertChange}
                required
                autoFocus
              />
            </div>

            <div className="form-label-group my-2">
              <label htmlFor="googleType">Google Type</label>
              <select
                className="form-control"
                id="googleType"
                value={googleType}
                onChange={this.handleUpsertChange}
              >
                {googleTypes.map((placeType, i) => {
                  return (
                    <option
                      key={placeType}
                      value={placeType}
                      defaultValue={i === 0}
                    >
                      {placeType}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-label-group my-2">
              <label htmlFor="hereCategorie">Here Categorie</label>
              <select
                className="form-control"
                id="hereCategorie"
                value={hereCategorie}
                onChange={this.handleUpsertChange}
              >
                {hereCategories.map(hereCategorie => {
                  return (
                    <option key={hereCategorie.id} value={hereCategorie.id}>
                      {hereCategorie.title}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-label-group my-2">
              <label htmlFor="fontAwesomeIcon">Icon</label>
              <select
                className="form-control"
                id="fontAwesomeIcon"
                value={fontAwesomeIcon}
                onChange={this.handleUpsertChange}
              >
                {fontAwesomeIcons.map(i => {
                  return (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              className="btn btn-lg btn-primary btn-block text-uppercase mt-4"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Types);
