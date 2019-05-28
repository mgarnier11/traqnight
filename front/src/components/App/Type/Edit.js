import React, { Component } from "react";
import { Link, withRouter } from 'react-router-dom';
import { Button, Form, Col } from "react-bootstrap";

import apiHandler from '../../../api/apiHandler';

class CreateType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            type: undefined,
            error: undefined
        };

        this.handleChange = this.handleChange.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        try {
            this.setState({ type: await apiHandler.typeService.get(this.state.id) });
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    validateForm() {
        return this.state.type.name.length > 0;
    }

    handleChange = event => {
        let type = { ...this.state.type };

        type[event.target.id] = event.target.value

        this.setState({
            type: type
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ error: "" });

        try {

            await apiHandler.typeService.update(this.state.id, { name: this.state.type.name });
            this.props.history.push('/admin');
        } catch (error) {
            console.log(error);

            this.setState({ error: error.message });
        }
    }

    render() {
        return (
            <div className="col-md-6 offset-md-3">
                <h1 className="text-center">Artwork Type</h1>
                {this.state.type ? this.renderType(this.state.type) : <div className="loading"></div>}
                <div className="error text-center">{this.state.error}</div>
            </div >
        );
    }

    renderType(type) {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={type.name}
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
                            Update
                        </Button>
                    </Col>
                    <Link to="/admin" className="btn btn-danger col">
                        Return
                    </Link>
                </Form.Row>
            </Form>
        )
    }
}

export default withRouter(CreateType);