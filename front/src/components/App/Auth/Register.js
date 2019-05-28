import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Button, Form, Col } from "react-bootstrap";
import "./Auth.css";

import apiHandler from '../../../api/apiHandler';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: '',
            error: ''
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0 && this.state.name.length > 0;
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
            await apiHandler.register({ email: this.state.email, name: this.state.name, password: this.state.password });
            this.props.history.push('/admin');
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    render() {
        return (
            <div className="Register">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            autoFocus
                            type="text"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </Form.Group>
                    <Form.Row>
                        <Col>
                            <Button
                                block
                                disabled={!this.validateForm()}
                                type="submit"
                            >
                                Register
                            </Button>
                        </Col>
                    </Form.Row>
                    {this.state.error}
                </Form>
            </div >
        );
    }
}

export default withRouter(Register);