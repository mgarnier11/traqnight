import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Form, Col } from 'react-bootstrap';

import placesTypes from '../../../json/googleplaces.json';
import fontAwesomeIcons from '../../../json/fontawesome.json';

import apiHandler from '../../../api/apiHandler';
import styles from './Type.module.css';
import Error from '../Error/Error.jsx';

class CreateType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      type: undefined
    };

    this.handleChange = this.handleChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    try {
      this.setState({ type: await apiHandler.typeService.get(this.state.id) });
    } catch (error) {
      Error.showError(error.message);
    }
  }

  validateForm() {
    return this.state.type.name.length > 0;
  }

  handleChange = event => {
    let type = { ...this.state.type };

    type[event.target.id] = event.target.value;

    this.setState({
      type: type
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ error: '' });

    try {
      await apiHandler.typeService.patch(this.state.id, {
        name: this.state.type.name,
        type: this.state.type.type,
        icon: this.state.type.icon
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
        <h1 className="text-center">Artwork Type</h1>
        {this.state.type ? (
          this.renderType(this.state.type)
        ) : (
          <div className="loading" />
        )}
      </div>
    );
  }

  renderType(type) {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={type.name}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="type">
          <Form.Label>Google Places API Type</Form.Label>
          <Form.Control
            as="select"
            value={type.type}
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
            <i className={'fas fa-' + type.icon + ' ' + styles.icon} />
          </Form.Label>
          <Form.Control
            as="select"
            value={type.icon}
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
              Update
            </Button>
          </Col>
          <Link to="/admin" className="btn btn-danger col">
            Return
          </Link>
        </Form.Row>
      </Form>
    );
  }
}

export default withRouter(CreateType);
