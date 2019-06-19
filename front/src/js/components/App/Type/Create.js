import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Form, Col } from 'react-bootstrap';

import apiHandler from '../../../api/apiHandler';

import placesTypes from '../../../json/googleplaces.json';
import fontAwesomeIcons from '../../../json/fontawesome.json';

import styles from './Type.module.css';
import Error from '../Error/Error.jsx';

class CreateType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      googleType: 'accounting',
      icon: 'ad'
    };

    this.handleChange = this.handleChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return this.state.name.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    try {
      await apiHandler.typeService.create({
        name: this.state.name,
        type: this.state.googleType,
        icon: this.state.icon
      });
      this.props.history.push('/admin');
    } catch (error) {
      console.log(error);

      Error.showError(error.message);
    }
  };

  render() {
    return (
      <div className="col-md-6 offset-md-3">
        <h1 className="text-center">Create a new Type</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="googleType">
            <Form.Label>Google Places API Type</Form.Label>
            <Form.Control
              as="select"
              value={this.state.googleType}
              onChange={this.handleChange}
            >
              {placesTypes.map(placeType => {
                return (
                  <option key={placeType} value={placeType}>
                    {placeType}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="icon">
            <Form.Label>
              Displayed Icon :{' '}
              <i className={'fas fa-' + this.state.icon + ' ' + styles.icon} />
            </Form.Label>
            <Form.Control
              as="select"
              value={this.state.icon}
              onChange={this.handleChange}
            >
              {fontAwesomeIcons.map(icon => {
                return (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
          <Form.Row>
            <Col>
              <Button block disabled={!this.validateForm()} type="submit">
                Create
              </Button>
            </Col>
            <Link className="col btn btn-danger" to="/admin">
              Return
            </Link>
          </Form.Row>
        </Form>
      </div>
    );
  }
}

export default withRouter(CreateType);
