import React, { Component } from "react";
import { Link, withRouter } from 'react-router-dom';
import { Button, Form, Col } from "react-bootstrap";

import apiHandler from '../../../api/apiHandler';

class CreateType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ''
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
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ error: "" });

        try {
            await apiHandler.typeService.create({ name: this.state.name });
            this.props.history.push('/admin');
        } catch (error) {
            console.log(error);

            this.setState({ error: error.message });
        }
    }

    render() {
        return (
            <div className="col-md-6 offset-md-3">
                <h1 className="text-center">Create a new Artwork Type</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            autoFocus
                            type="text"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Row>
                        <Col>
                            <Button
                                block
                                disabled={!this.validateForm()}
                                type="submit"
                            >
                                Create
                            </Button>
                        </Col>
                        <Link className="col btn btn-danger" to="/admin">
                            Return
                        </Link>
                    </Form.Row>
                </Form>
                <div className="error text-center">{this.state.error}</div>
            </div >
        );
    }
}

export default withRouter(CreateType);