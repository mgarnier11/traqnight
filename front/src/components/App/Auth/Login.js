import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Button, Form, Col } from "react-bootstrap";
import "./Auth.css";

import apiHandler from '../../../api/apiHandler';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: ''
        };
    }

    async componentWillMount() {
        apiHandler.logout();
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ error: "" });

        var error = await apiHandler.login({ email: this.state.email, password: this.state.password });

        if (error) {
            this.setState({ error: error.message });
        } else {
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <div className="Login">
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
                                type="submit">
                                Login
                                </Button>
                        </Col>
                    </Form.Row>
                    {this.state.error}
                </Form>
            </div >
        );
    }

}

export default withRouter(Login);